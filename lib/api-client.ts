import axios from "axios";
import { getToken } from "./auth-store";

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
    console.error(err.response?.data || err.message);
    return Promise.reject(err);
  }
);

export default apiClient;