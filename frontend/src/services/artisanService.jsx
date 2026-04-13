import apiClient from "./api";

export const searchArtisans = async ({ metier, location }) => {
  const response = await apiClient.get("/artisans/search/", {
    params: { metier, location },
  });
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
