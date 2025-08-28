"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "@/hooks/use-toast"
import { 
  getProductLifetimeDetails, 
  createProductLifetimeDetails, 
  updateProductLifetimeDetails, 
  deleteProductLifetimeDetails,
  type ProductLifetimeDetails,
  type CreateLifetimeDetailsRequest,
  type UpdateLifetimeDetailsRequest
} from "@/lib/Api/productLifetimeDetails"

export function useProductLifetimeDetails(productId: string) {
  const queryClient = useQueryClient()

  // Fetch lifetime details
  const {
    data: lifetimeDetails,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["product-lifetime-details", productId],
    queryFn: async () => {
      const result = await getProductLifetimeDetails(productId);
      console.log("Lifetime details result:", result);
      return result;
    },
    enabled: !!productId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Create lifetime details
  const createLifetimeDetailsMutation = useMutation({
    mutationFn: (data: CreateLifetimeDetailsRequest) => createProductLifetimeDetails(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-lifetime-details", productId] })
      toast({
        title: "Success",
        description: "Lifetime details created successfully",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to create lifetime details",
        variant: "destructive",
      })
    },
  })

  // Update lifetime details
  const updateLifetimeDetailsMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLifetimeDetailsRequest }) => 
      updateProductLifetimeDetails(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-lifetime-details", productId] })
      toast({
        title: "Success",
        description: "Lifetime details updated successfully",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to update lifetime details",
        variant: "destructive",
      })
    },
  })

  // Delete lifetime details
  const deleteLifetimeDetailsMutation = useMutation({
    mutationFn: (id: string) => deleteProductLifetimeDetails(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-lifetime-details", productId] })
      toast({
        title: "Success",
        description: "Lifetime details deleted successfully",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to delete lifetime details",
        variant: "destructive",
      })
    },
  })

  return {
    lifetimeDetails,
    isLoading,
    error,
    refetch,
    createLifetimeDetails: createLifetimeDetailsMutation,
    updateLifetimeDetails: updateLifetimeDetailsMutation,
    deleteLifetimeDetails: deleteLifetimeDetailsMutation,
  }
}
