import api from "@/utils/axios";

export const getLocationUsers = async ({
  locationId,
  page = 1,
  take = 10,
}: {
  locationId: string;
  page?: number;
  take?: number;
}) => {
  const response = await api.get(`/location-users/by-location/${locationId}`, {
    params: { page, take },
  });
  return response.data;
}; 