import axios from "axios";
import { getToken, clearSession } from "./auth-store";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
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
    if (status === 401) {
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
