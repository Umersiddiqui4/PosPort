import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "@/hooks/use-toast"
import api from "@/utils/axios"

// Types
export interface User {
  id: string
  createdAt: string
  updatedAt: string
  firstName: string
  lastName: string
  email: string
  phone: string
  role: string
  companyId: string | null
}

export interface UsersResponse {
  data: User[]
  meta: {
    page: number
    take: number
    itemCount: number
    pageCount: number
    hasPreviousPage: boolean
    hasNextPage: boolean
  }
  message: string
  statusCode: number
  success: boolean
}

export interface CreateUserData {
  firstName: string
  lastName: string
  email: string
  phone: string
  role: string
  companyId?: string | null
}

export interface UpdateUserData extends CreateUserData {
  id: string
}

// API Functions
// Remove API_BASE_URL, use api's baseURL

const fetchUsers = async (companyId?: string, page = 1, take = 10, searchTerm?: string): Promise<UsersResponse> => {
  const params: any = {
    page,
    take,
  };
  
  // Add companyId to params if provided
  if (companyId) {
    params.companyId = companyId;
  }

  // Add search term to params if provided
  if (searchTerm && searchTerm.trim()) {
    params.q = searchTerm.trim();
  }
  
  const response = await api.get(`/users`, { params })
  return response.data
}

const createUser = async (userData: CreateUserData): Promise<User> => {
  // Ensure companyId is included in the payload, even if null
  const payload = {
    ...userData,
    companyId: userData.companyId ?? null,
  }
  const response = await api.post(`/users`, payload)
  return response.data
}

const updateUser = async ({ id, companyId, ...userData }: UpdateUserData): Promise<User> => {
  // Ensure companyId is included in the payload, even if null
  const payload = {
    ...userData,
    companyId: companyId ?? null,
  }
  const response = await api.put(`/users/${id}`, payload)
  return response.data
}

const deleteUser = async (id: string): Promise<void> => {
  await api.delete(`/users/${id}`)
}

// Custom Hooks
export const useUsers = (companyId?: string, page = 1, take = 10, searchTerm?: string) => {
  return useQuery({
    queryKey: ["users", companyId, page, take, searchTerm],
    queryFn: () => fetchUsers(companyId, page, take, searchTerm),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    refetchOnWindowFocus: false, // Prevent refetch on window focus
    refetchOnMount: false, // Prevent refetch on mount if data exists
    refetchOnReconnect: false, // Prevent refetch on reconnect
  })
}

export const useCreateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      toast({
        title: "Success",
        description: "User created successfully",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create user",
        variant: "destructive",
      })
    },
  })
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      toast({
        title: "Success",
        description: "User updated successfully",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update user",
        variant: "destructive",
      })
    },
  })
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      toast({
        title: "Success",
        description: "User deleted successfully",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
        variant: "destructive",
      })
    },
  })
}
