import api from "@/utils/axios";

export const updateLocationUser = async ({
  userId,
  locationId,
  firstName,
  lastName,
  email,
  role,
  status,
}: {
  userId: string;
  locationId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
}) => {
  const response = await api.put(`/users/${userId}`, {
    locationId,
    firstName,
    lastName,
    email,
    role,
    status,
  });
  return response.data;
}; 