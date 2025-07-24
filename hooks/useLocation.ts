import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "@/components/ui/use-toast"
import api from "@/utils/axios"
import { useUserDataStore } from "@/lib/store"

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
}

interface UpdateLocationData extends CreateLocationData {
  id: string
}

const API_BASE_URL = "https://dev-api.posport.io/api/v1"



const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

const token = getToken();

// Fetch locations
export const useLocations = (page = 1, take = 30, searchTerm?: string, companyId?: string, userId?: string) => {
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
  });
};

// Create location
export const useCreateLocation = () => {
  const queryClient = useQueryClient()
  const user = useUserDataStore((state) => state.user)
  return useMutation({
    mutationFn: async (data: CreateLocationData) => {
      const response = await api.post(`/locations`, {
        ...data,
        qrCode: data.qrCode || `${data.locationName.replace(/\s+/g, "-")}-QR`,
        companyId: user?.companyId
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
