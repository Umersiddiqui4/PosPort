import api from "@/utils/axios";

interface Device {
  id: string;
  deviceName: string;
  deviceType: string;
  deviceCode: string;
  createdAt: string;
  updatedAt: string;
}

interface GetAllDevicesResponse {
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

export const getAllDevices = async (page = 1, take = 10, active = true): Promise<GetAllDevicesResponse> => {
  const response = await api.get("/devices", {
    params: { page, take, active },
  });
  return response.data;
}; 