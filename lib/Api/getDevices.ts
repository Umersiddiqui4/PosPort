import api from "@/utils/axios";

export interface Device {
  id: string;
  deviceName: string;
  deviceType: string;
  deviceCode: string;
  createdAt: string;
  updatedAt: string;
  // Add any other fields as needed from the API response
}

export interface GetDevicesResponse {
  items: Device[];
  meta: {
    page: number;
    take: number;
    itemCount: number;
    pageCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

export const getDevices = async (page = 1, take = 10): Promise<GetDevicesResponse> => {
  const response = await api.get("/devices", {
    params: { page, take },
  });
  return response.data;
}; 