import api from "@/utils/axios";

export const assignDeviceToLocation = async ({
  deviceId,
  locationId,
}: {
  deviceId: string;
  locationId: string;
}) => {
  const response = await api.post("/location-devices/assign", {
    deviceId,
    locationId,
  });
  return response.data;
}; 