import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Ignore 401 for login endpoint to allow form error handling
      if (error.config?.url?.includes("/auth/login")) {
        return Promise.reject(error);
      }

      // Token expired or invalid
      localStorage.removeItem("jwt_token");
      localStorage.removeItem("activeUser");

      // Trigger login offcanvas
      import("../utils/offcanvas").then(({ remountLoginOffcanvas }) => {
        remountLoginOffcanvas();
      });

      window.location.href = "/"; // Redirect to home
    }
    return Promise.reject(error);
  }
);

export default apiClient;
