import api from "@/utils/axios";

export const unassignDeviceFromLocation = async ({
  deviceId,
}: {
  deviceId: string;
}) => {
  const response = await api.post("/location-devices/unassign", {
    deviceId,
  });
  return response.data;
}; 