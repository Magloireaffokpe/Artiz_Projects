import apiClient from "./api";

export const searchArtisans = async ({ metier, ville }) => {
  const response = await apiClient.get("/artisans/search/", {
    params: {
      metier,
      location: ville, // le backend attend "location"
    },
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
