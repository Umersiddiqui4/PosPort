import api from "@/utils/axios";

interface CreateDeviceRequest {
  deviceCode: string;
  deviceName: string;
  deviceType: string;
}

interface Device {
  id: string;
  deviceCode: string;
  deviceName: string;
  deviceType: string;
  createdAt: string;
  updatedAt: string;
}

export const createDevice = async (deviceData: CreateDeviceRequest): Promise<Device> => {
  try {
    const response = await api.post("/devices", deviceData);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to create device");
  }
};
