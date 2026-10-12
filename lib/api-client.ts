import axios from "axios";
import { getToken, clearSession } from "./auth-store";

// In development, route through the same-origin Next.js rewrite (/api-proxy/*)
// so the browser never makes a cross-origin call the backend's CORS allowlist
// would block. Production keeps using the absolute backend URL.
const baseURL =
  process.env.NODE_ENV === 'development'
    ? '/api-proxy'
    : process.env.NEXT_PUBLIC_API_BASE_URL;

const apiClient = axios.create({
  baseURL,
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  res => res,
  err => {
    const status = err.response?.status;
    const isPublicTrackingRequest = typeof err.config?.url === 'string'
      && err.config.url.includes('/shipments/tracking/')
    if (status === 401 && !isPublicTrackingRequest) {
      clearSession();
      if (typeof window !== 'undefined') {
        const isAuthPage = window.location.pathname.startsWith('/(auth)')
          || ['/lets-get-you-in', '/sign-in', '/register', '/forgot-password', '/verify-email'].some(p =>
            window.location.pathname.startsWith(p)
          );
        if (!isAuthPage) {
          window.location.href = '/lets-get-you-in';
        }
      }
    }
    console.error(err.response?.data || err.message);
    return Promise.reject(err);
  }
);

export default apiClient;
