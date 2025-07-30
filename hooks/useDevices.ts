import { useQuery } from "@tanstack/react-query";
import { getDevices } from "@/lib/Api/getDevices";

export const useDevices = (locationId: string, page = 1, take = 10, active = true) => {
  return useQuery({
    queryKey: ["devices", locationId, page, take, active],
    queryFn: () => getDevices(locationId, page, take, active),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}; 