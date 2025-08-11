"use client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "@/hooks/use-toast"
import { getProducts, Product as APIProduct } from "@/lib/Api/getProducts"
import { createProduct } from "@/lib/Api/createProduct"
import { updateProduct } from "@/lib/Api/updateProduct"
import { deleteProduct } from "@/lib/Api/deleteProduct"
import type { CreateProductRequest } from "@/lib/Api/createProduct"
import type { UpdateProductRequest } from "@/lib/Api/updateProduct"

// Product interface matching API
export interface Product extends APIProduct {}

export function useProducts(page: number = 1, take: number = 10) {
  const queryClient = useQueryClient()

  // Fetch products
  const {
    data: products = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["products", page, take],
    queryFn: () => getProducts(page, take),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Create product
  const createProductMutation = useMutation({
    mutationFn: (productData: CreateProductRequest) => createProduct(productData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      toast({
        title: "Success",
        description: "Product created successfully",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to create product",
        variant: "destructive",
      })
    },
  })

  // Update product
  const updateProductMutation = useMutation({
    mutationFn: ({ id, ...productData }: { id: string } & UpdateProductRequest) => updateProduct(id, productData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      toast({
        title: "Success",
        description: "Product updated successfully",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to update product",
        variant: "destructive",
      })
    },
  })

  // Delete product
  const deleteProductMutation = useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      toast({
        title: "Success",
        description: "Product deleted successfully",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to delete product",
        variant: "destructive",
      })
    },
  })

  return {
    products,
    isLoading,
    error,
    refetch,
    createProduct: createProductMutation,
    updateProduct: updateProductMutation,
    deleteProduct: deleteProductMutation,
  }
} 