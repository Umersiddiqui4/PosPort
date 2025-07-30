import { useQuery } from "@tanstack/react-query"
import { getAssignedUsers, GetAssignedUsersResponse } from "@/lib/Api/getAssignedUsers"

export const useAssignedUsers = (page = 1, take = 10) => {
  return useQuery({
    queryKey: ["assigned-users", page, take],
    queryFn: () => getAssignedUsers(page, take),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
} 