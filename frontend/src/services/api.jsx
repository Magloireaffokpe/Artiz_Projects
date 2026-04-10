import axios from "axios";
import { API_BASE_URL } from "../config";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  // ✅ Supprimez l'en-tête Content-Type global
});

// Intercepteur pour ajouter le token (sauf sur /auth/)
apiClient.interceptors.request.use((config) => {
  // Si c'est un FormData, laissez axios gérer le Content-Type
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }
  if (config.url.includes("/auth/")) {
    return config;
  }
  const access = localStorage.getItem("access");
  if (access) {
    config.headers.Authorization = `Bearer ${access}`;
  }
  return config;
});

// Intercepteur pour rafraîchir le token (inchangé)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refresh = localStorage.getItem("refresh");
        const res = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
          refresh,
        });
        const newAccess = res.data.access;
        localStorage.setItem("access", newAccess);
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return apiClient(originalRequest);
      } catch (err) {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
