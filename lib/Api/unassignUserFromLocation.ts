import api from "@/utils/axios";

export const unassignUserFromLocation = async ({
  userId,
  locationId,
}: {
  userId: string;
  locationId: string;
}) => {
  const response = await api.post("/location-users/unassign", {
    userId,
    locationId,
  });
  return response.data;
}; 