import apiClient from "./api";

export const searchArtisans = async ({ metier, location }) => {
  const params = {};
  if (metier && metier.trim()) params.metier = metier.trim();
  if (location && location.trim()) params.location = location.trim();

  const response = await apiClient.get("/artisans/search/", { params });
  return response.data;
};

export const getAllArtisans = async () => {
  const response = await apiClient.get("/artisans/");
  return response.data;
};

export const getArtisanById = async (id) => {
  const response = await apiClient.get(`/artisans/${id}/`);
  return response.data;
};
