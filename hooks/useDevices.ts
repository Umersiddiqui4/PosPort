import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDevices } from "@/lib/Api/getDevices";
import { assignDeviceToLocation } from "@/lib/Api/assignDeviceToLocation";
import { unassignDeviceFromLocation } from "@/lib/Api/unassignDeviceFromLocation";
import { getAllDevices } from "@/lib/Api/getAllDevices";
import { createDevice } from "@/lib/Api/createDevice";

export const useDevices = (locationId: string, page = 1, take = 10, active = true) => {
  return useQuery({
    queryKey: ["devices", locationId, page, take, active],
    queryFn: () => getDevices(locationId, page, take, active),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useAllDevices = (page = 1, take = 10, active = true, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["all-devices", page, take, active],
    queryFn: () => getAllDevices(page, take, active),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: options?.enabled ?? true,
  });
};

export const useAssignDeviceToLocation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: assignDeviceToLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["devices"] });
    },
    onError: (error: any) => {
      // Surface detailed error to UI
      throw new Error(error?.message || "Failed to assign device to location");
    },
  });
};

export const useUnassignDeviceFromLocation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: unassignDeviceFromLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["devices"] });
    },
    onError: (error: any) => {
      // Surface detailed error to UI
      throw new Error(error?.message || "Failed to unassign device from location");
    },
  });
};

export const useCreateDevice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createDevice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-devices"] });
    },
    onError: (error: any) => {
      // Surface detailed error to UI
      throw new Error(error?.message || "Failed to create device");
    },
  });
}; 