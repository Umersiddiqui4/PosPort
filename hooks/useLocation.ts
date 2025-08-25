import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "@/components/ui/use-toast"
import api from "@/utils/axios"
import { useUserDataStore } from "@/lib/store"
import { assignUserToLocation } from "@/lib/Api/assignUserToLocation";
import { getLocationUsers } from "@/lib/Api/getLocationUsers";
import { unassignUserFromLocation } from "@/lib/Api/unassignUserFromLocation";
import { updateLocationUser } from "@/lib/Api/updateLocationUser";

interface Location {
  id: string
  createdAt: string
  updatedAt: string
  qrCode: string
  locationName: string
  address: string
  city: string
  state: string
  country: string
  postalCode: string
  phone: string
  email: string
}

interface LocationsResponse {
  items: Location[]
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
}

interface CreateLocationData {
  qrCode?: string
  locationName: string
  address: string
  city: string
  state: string
  country: string
  postalCode: string
  phone: string
  email: string
  companyId?: string
}

interface UpdateLocationData extends CreateLocationData {
  id: string
}

// const API_BASE_URL = "https://dev-api.posport.io/api/v1" // Unused variable

// const getToken = () => {
//   if (typeof window !== "undefined") {
//     return localStorage.getItem("token");
//   }
//   return null;
// };

// const token = getToken(); // Unused variable

// Fetch locations
export const useLocations = (page = 1, take = 10, searchTerm?: string, companyId?: string, userId?: string) => {
  return useQuery<LocationsResponse>({
    queryKey: ["locations", page, take, searchTerm, companyId, userId],
    queryFn: async () => {
      let params: any = { user: false };
      if (searchTerm) {
        params.q = searchTerm;
        // Do NOT include page and take when searching
      } else {
        params.page = page;
        params.take = take;
      }
      if (companyId) {
        params.companyId = companyId;
      }
      if (userId) {
        params.userId = userId;
      }
      console.log('Fetching locations with params:', params);
      const response = await api.get(`/locations`, { params });
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    placeholderData: (prev) => prev,
  });
};

// Create location
export const useCreateLocation = () => {
  const queryClient = useQueryClient()
  const user = useUserDataStore((state) => state.user)
  return useMutation({
    mutationFn: async (data: CreateLocationData) => {
      console.log(data, "data");
      
      const response = await api.post(`/locations`, {
        ...data,
        qrCode: data.qrCode || `${data.locationName.replace(/\s+/g, "-")}-QR`,
        companyId: user?.companyId || data.companyId
      })
      return response.data
    },
    onSuccess: () => {
      // Invalidate and refetch locations
      queryClient.invalidateQueries({ queryKey: ["locations"] })
      toast({
        title: "Success",
        description: "Location added successfully",
      })
    },
    onError: (error) => {
      console.error("Failed to create location:", error)
      toast({
        title: "Error",
        description: "Failed to add location. Please try again.",
        variant: "destructive",
      })
    },
  })
}

// Update location
export const useUpdateLocation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateLocationData) => {
      const response = await api.put(`/locations/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      // Invalidate and refetch locations
      queryClient.invalidateQueries({ queryKey: ["locations"] })
      toast({
        title: "Success",
        description: "Location updated successfully",
      })
    },
    onError: (error) => {
      console.error("Failed to update location:", error)
      toast({
        title: "Error",
        description: "Failed to update location. Please try again.",
        variant: "destructive",
      })
    },
  })
}

// Delete location
export const useDeleteLocation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/locations/${id}`)
      return response.data
    },
    onSuccess: () => {
      // Invalidate and refetch locations
      queryClient.invalidateQueries({ queryKey: ["locations"] })
      toast({
        title: "Success",
        description: "Location deleted successfully",
      })
    },
    onError: (error) => {
      console.error("Failed to delete location:", error)
      toast({
        title: "Error",
        description: "Failed to delete location. Please try again.",
        variant: "destructive",
      })
    },
  })
}

// Assign user to location
export const useAssignUserToLocation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: assignUserToLocation,
    onSuccess: () => {
      // Invalidate and refetch location users and users data
      queryClient.invalidateQueries({ queryKey: ["location-users"] })
      queryClient.invalidateQueries({ queryKey: ["users"] })
      queryClient.invalidateQueries({ queryKey: ["assigned-users"] })
    },
  });
};

// Unassign user from location
export const useUnassignUserFromLocation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: unassignUserFromLocation,
    onSuccess: () => {
      // Invalidate and refetch location users and users data
      queryClient.invalidateQueries({ queryKey: ["location-users"] })
      queryClient.invalidateQueries({ queryKey: ["users"] })
      queryClient.invalidateQueries({ queryKey: ["assigned-users"] })
    },
  });
};

// Update user in location
export const useUpdateLocationUser = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: updateLocationUser,
    onSuccess: () => {
      // Invalidate and refetch location users data
      queryClient.invalidateQueries({ queryKey: ["location-users"] })
    },
  });
};

// Fetch a single location by id
export const useLocationById = (id?: string) => {
  return useQuery<Location | null>({
    queryKey: ["location", id],
    queryFn: async () => {
      if (!id) return null;
      const response = await api.get(`/locations/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useLocationUsers = (locationId?: string, page = 1, take = 10) => {
  return useQuery({
    queryKey: ["location-users", locationId, page, take],
    queryFn: () =>
      locationId ? getLocationUsers({ locationId, page, take }) : Promise.resolve(null),
    enabled: !!locationId,
  });
};
