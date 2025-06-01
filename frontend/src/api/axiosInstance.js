// src/api/axiosInstance.js

import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/user/api/", // Replace with your API base URL
  headers: {
    "Content-Type": "application/json",
  },
  // timeout: 10000,
});

// Optional: Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // or use context/auth hook
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Optional: Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // handle errors globally
    console.error("API error:", error.response || error.message);
    return Promise.reject(error);
  },
);

export default axiosInstance;
