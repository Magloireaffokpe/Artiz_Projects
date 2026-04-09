import apiClient from "./api";

export const register = async (payload) => {
  return await apiClient.post("/auth/register/", payload);
};

export const login = async (payload) => {
  const response = await apiClient.post("/auth/login/", payload);

  // Stockage des tokens
  localStorage.setItem("access", response.data.access);
  localStorage.setItem("refresh", response.data.refresh);

  return response.data; // ← retourne directement { access, refresh, is_artisan, artisan_id }
};

export const getCurrentUser = async () => {
  return await apiClient.get("/auth/me/");
};
