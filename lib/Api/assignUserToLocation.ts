import api from "@/utils/axios";

export const assignUserToLocation = async ({
  userId,
  locationId,
}: {
  userId: string;
  locationId: string;
}) => {
  const response = await api.post("/location-users/assign", {
    userId,
    locationId,
  });
  return response.data;
}; 