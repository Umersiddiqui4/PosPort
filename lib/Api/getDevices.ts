import api from "@/utils/axios";

interface Device {
  id: string;
  name: string;
  // Add more fields as needed
}

interface GetDevicesResponse {
  data: Device[];
  meta: {
    locationId: string;
    page: number;
    take: number;
    itemCount: number;
    pageCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

export const getDevices = async (locationId: string, page = 1, take = 10, active = true): Promise<GetDevicesResponse> => {
  const response = await api.get(`/location-devices/by-location/${locationId}`, {
    params: { page, take, active },
  });
  return response.data;
}; 