import { useQuery } from "@tanstack/react-query";
import { getDevices, GetDevicesResponse } from "@/lib/Api/getDevices";

export const useDevices = (page = 1, take = 10) => {
  return useQuery<GetDevicesResponse>({
    queryKey: ["devices", page, take],
    queryFn: () => getDevices(page, take),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}; 