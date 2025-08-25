import api from "@/utils/axios";

export const unassignDeviceFromLocation = async ({
  deviceId,
}: {
  deviceId: string;
}) => {
  try {
    const response = await api.post("/location-devices/unassign", {
      deviceId,
    });
    return response.data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to unassign device from location";
    const statusCode = error?.response?.status;
    throw new Error(typeof message === "string" ? message : JSON.stringify(message) + (statusCode ? ` (HTTP ${statusCode})` : ""));
  }
}; 