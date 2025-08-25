import api from "@/utils/axios";

export const assignDeviceToLocation = async ({
  deviceId,
  locationId,
}: {
  deviceId: string;
  locationId: string;
}) => {
  try {
    const response = await api.post("/location-devices/assign", {
      deviceId,
      locationId,
    });
    return response.data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to assign device to location";
    const statusCode = error?.response?.status;
    throw new Error(typeof message === "string" ? message : JSON.stringify(message) + (statusCode ? ` (HTTP ${statusCode})` : ""));
  }
}; 