"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "@/hooks/use-toast"
import { 
  getProductInventory, 
  createProductInventory, 
  updateProductInventory, 
  updateProductStockQuantity,
  deleteProductInventory,
  type ProductInventory,
  type CreateInventoryRequest,
  type UpdateInventoryRequest,
  type UpdateStockQuantityRequest
} from "@/lib/Api/productInventory"

export function useProductInventory(productId: string) {
  const queryClient = useQueryClient()

  // Fetch inventory
  const {
    data: inventory,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["product-inventory", productId],
    queryFn: async () => {
      const result = await getProductInventory(productId);
      console.log("Inventory result:", result);
      return result;
    },
    enabled: !!productId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Create inventory
  const createInventoryMutation = useMutation({
    mutationFn: (data: CreateInventoryRequest) => createProductInventory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-inventory", productId] })
      toast({
        title: "Success",
        description: "Inventory created successfully",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to create inventory",
        variant: "destructive",
      })
    },
  })

  // Update inventory
  const updateInventoryMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateInventoryRequest }) => 
      updateProductInventory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-inventory", productId] })
      toast({
        title: "Success",
        description: "Inventory updated successfully",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to update inventory",
        variant: "destructive",
      })
    },
  })

  // Update stock quantity only
  const updateStockQuantityMutation = useMutation({
    mutationFn: (data: UpdateStockQuantityRequest) => 
      updateProductStockQuantity(productId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-inventory", productId] })
      toast({
        title: "Success",
        description: "Stock quantity updated successfully",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to update stock quantity",
        variant: "destructive",
      })
    },
  })

  // Delete inventory
  const deleteInventoryMutation = useMutation({
    mutationFn: (id: string) => deleteProductInventory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-inventory", productId] })
      toast({
        title: "Success",
        description: "Inventory deleted successfully",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to delete inventory",
        variant: "destructive",
      })
    },
  })

  return {
    inventory,
    isLoading,
    error,
    refetch,
    createInventory: createInventoryMutation,
    updateInventory: updateInventoryMutation,
    updateStockQuantity: updateStockQuantityMutation,
    deleteInventory: deleteInventoryMutation,
  }
}
