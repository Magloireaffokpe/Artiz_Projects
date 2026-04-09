import apiClient from "./api";

// 🔥 Créer réservation
export const createReservation = async (artisanId, data) => {
  const response = await apiClient.post(
    `/artisans/${artisanId}/reserve/`,
    data,
  );
  return response.data;
};

// 🔥 Récupérer réservations artisan
export const getReservations = async () => {
  const response = await apiClient.get("/dashboard/reservations/");
  return response.data;
};

// 🔥 Modifier statut
export const updateReservationStatus = async (id, status) => {
  const response = await apiClient.patch(`/reservations/${id}/status/`, {
    status,
  });
  return response.data;
};
