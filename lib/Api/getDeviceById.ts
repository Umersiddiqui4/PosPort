import api from "@/utils/axios";

export const getDeviceById = async (id: string) => {
  const response = await api.get(`/devices/${id}`);
  return response.data;
}; 