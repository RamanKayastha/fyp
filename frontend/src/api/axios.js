import axios from "axios";

// BACKEND URL
const api = axios.create({
  baseURL: "http://localhost:8080",
  maxContentLength: 30 * 1024 * 1024,
  maxBodyLength: 30 * 1024 * 1024,
});

// TOKEN SETUP
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// TOKEN EXPIRATION
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const requestUrl = error.config?.url || "";
      const method = (error.config?.method || "").toLowerCase();
      const isPublicProductRead =
        method === "get" && requestUrl.includes("/api/products");

      if (!isPublicProductRead) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default api;