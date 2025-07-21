import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "@/components/ui/use-toast"

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
export const useLocations = (page = 1, take = 10) => {
  return useQuery<LocationsResponse>({
    queryKey: ["locations", page, take],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/locations?page=${page}&take=${take}&user=false`, {
         headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  },
      })
      

      if (!response.ok) {
        throw new Error(`Error fetching locations: ${response.status}`)
      }

      return response.json()
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Create location
export const useCreateLocation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateLocationData) => {
      const response = await fetch(`${API_BASE_URL}/locations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...data,
          qrCode: data.qrCode || `${data.locationName.replace(/\s+/g, "-")}-QR`,
          companyId: "e59dc897-9b18-4784-a46a-f4f0b1cf536d"
        }),
      })

      if (!response.ok) {
        throw new Error(`Error creating location: ${response.status}`)
      }

      return response.json()
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
      const response = await fetch(`${API_BASE_URL}/locations/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`Error updating location: ${response.status}`)
      }

      return response.json()
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
      const response = await fetch(`${API_BASE_URL}/locations/${id}`, {
        method: "DELETE",
  headers: {
    "Authorization": `Bearer ${token}`,
  },
      })

      if (!response.ok) {
        throw new Error(`Error deleting location: ${response.status}`)
      }

      return response.json()
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
