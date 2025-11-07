import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true, // important if using cookies
});

apiClient.interceptors.response.use(
  res => res,
  err => {
    console.error(err.response?.data || err.message);
    return Promise.reject(err);
  }
);

export default apiClient;
