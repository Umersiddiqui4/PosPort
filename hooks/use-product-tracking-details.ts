"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "@/hooks/use-toast"
import { 
  getProductTrackingDetails, 
  createProductTrackingDetails, 
  updateProductTrackingDetails, 
  deleteProductTrackingDetails,
  type ProductTrackingDetails,
  type CreateTrackingDetailsRequest,
  type UpdateTrackingDetailsRequest
} from "@/lib/Api/productTrackingDetails"

export function useProductTrackingDetails(productId: string) {
  const queryClient = useQueryClient()

  // Fetch tracking details
  const {
    data: trackingDetails,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["product-tracking-details", productId],
    queryFn: async () => {
      const result = await getProductTrackingDetails(productId);
      console.log("Tracking details result:", result);
      return result;
    },
    enabled: !!productId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Create tracking details
  const createTrackingDetailsMutation = useMutation({
    mutationFn: (data: CreateTrackingDetailsRequest) => createProductTrackingDetails(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-tracking-details", productId] })
      toast({
        title: "Success",
        description: "Tracking details created successfully",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to create tracking details",
        variant: "destructive",
      })
    },
  })

  // Update tracking details
  const updateTrackingDetailsMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTrackingDetailsRequest }) => 
      updateProductTrackingDetails(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-tracking-details", productId] })
      toast({
        title: "Success",
        description: "Tracking details updated successfully",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to update tracking details",
        variant: "destructive",
      })
    },
  })

  // Delete tracking details
  const deleteTrackingDetailsMutation = useMutation({
    mutationFn: (id: string) => deleteProductTrackingDetails(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-tracking-details", productId] })
      toast({
        title: "Success",
        description: "Tracking details deleted successfully",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to delete tracking details",
        variant: "destructive",
      })
    },
  })

  return {
    trackingDetails,
    isLoading,
    error,
    refetch,
    createTrackingDetails: createTrackingDetailsMutation,
    updateTrackingDetails: updateTrackingDetailsMutation,
    deleteTrackingDetails: deleteTrackingDetailsMutation,
  }
}
