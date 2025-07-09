import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const storageAxios = axios.create({
  baseURL: API_BASE_URL + "/funchive-storage-service",
  headers: {
    // Note: Content-Type will be set automatically for FormData
  },
  timeout: 30000, // Longer timeout for file uploads
});

storageAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

storageAxios.interceptors.response.use(
  (response) => {
    const { code, message } = response.data;

    if (code && code !== "SUCCESS") {
      throw new Error(message);
    }

    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);
