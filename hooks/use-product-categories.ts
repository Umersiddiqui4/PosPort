"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "@/hooks/use-toast"
import { getCategories } from "@/lib/Api/getCategories"
import { useUpdateCategory } from "@/lib/Api/updateCategory"
import { deleteCategory } from "@/lib/Api/deleteCategory"
import { CategoryResponse, createCategory, CreateCategoryPayload } from "@/lib/Api/createCategory"

export interface ProductCategory {
  id: string
  categoryName: string
  description: string
  status: "active" | "inactive"
  color: string
  icon: string
  parentId?: string
  productCount?: number
  companyId: string
  locationId: string
  menuId: string
  createdAt: string
  updatedAt: string
}

const fetchProductCategories = async (): Promise<ProductCategory[]> => {
  const response = await getCategories(1, 10);
  return response.items.map((item: any) => ({
    id: item.id,
    categoryName: item.categoryName,
    description: item.description,
    status: item.status,
    color: item.color,
    icon: item.icon,
    parentId: item.parentId,
    productCount: item.productCount,
    companyId: item.companyId,
    locationId: item.locationId,
    menuId: item.menuId,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  }));
}

export const useCreateProductCategory = () => {
  const queryClient = useQueryClient()

  return useMutation<CategoryResponse, Error, CreateCategoryPayload>({
    mutationFn: (data) => createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-categories"] })
      toast({
        title: "Success",
        description: "Product category created successfully",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create product category",
        variant: "destructive",
      })
    },
  })
}

export const useUpdateProductCategory = () => {
  const queryClient = useQueryClient();
  const mutation = useUpdateCategory();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ProductCategory> }) => {
      return await mutation.mutateAsync({ id, ...data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-categories"] });
      toast({
        title: "Success",
        description: "Product category updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update product category",
        variant: "destructive",
      });
    },
  });
};

export const useProductCategories = () => {
  return useQuery({
    queryKey: ["product-categories"],
    queryFn: fetchProductCategories,
  })
}

export const useDeleteProductCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-categories"] })
      toast({
        title: "Deleted",
        description: "Product category deleted successfully",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete product category",
        variant: "destructive",
      })
    },
  })
}
