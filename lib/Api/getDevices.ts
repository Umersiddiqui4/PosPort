import api from "@/utils/axios";

interface DeviceData {
  id: string;
  deviceName: string;
  deviceType: string;
  deviceCode: string;
  createdAt: string;
  updatedAt: string;
}

interface LocationData {
  id: string;
  locationName: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phone: string;
  email: string;
  qrCode: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

interface AssignedDevice {
  id: string;
  assignedAt: string;
  assignedById: string;
  unassignedAt: string | null;
  unassignedById: string | null;
  device: DeviceData;
  location: LocationData;
}

interface GetDevicesResponse {
  data: AssignedDevice[];
  meta: {
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