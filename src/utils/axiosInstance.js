import axios from "axios";
import { isTokenExpired } from "./tokenValidation";

const axiosInstance = axios.create({
  baseURL: "http://localhost:9090",
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");

  if (token) {
    if (isTokenExpired(token)) {
      store.dispatch(logout());
      window.location.href = "/login";
      return Promise.reject(new Error("Token expired"));
    }
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(logout());
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
