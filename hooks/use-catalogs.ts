"use client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "@/hooks/use-toast"
import { getCatalogs, Catalog as APICatalog, GetCatalogsResponse } from "@/lib/Api/getCatalogs"
import { createCatalog } from "@/lib/Api/createCatalog"
import { updateCatalog } from "@/lib/Api/updateCatalog"
import { deleteCatalog } from "@/lib/Api/deleteCatalog"
import type { CreateCatalogRequest } from "@/lib/Api/createCatalog"
import type { UpdateCatalogRequest } from "@/lib/Api/updateCatalog"

// Catalog interface matching API
export interface Catalog extends APICatalog {}

export function useCatalogs(page: number = 1, take: number = 9, search: string = "") {
  const queryClient = useQueryClient()

  // Fetch all catalogs
  const {
    data,
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["catalogs", page, take, search],
    queryFn: () => getCatalogs(page, take, search),
    staleTime: 5 * 60 * 1000, // 5 minutes
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  })
  const catalogs = (data as GetCatalogsResponse | undefined)?.items || []
  const meta = (data as GetCatalogsResponse | undefined)?.meta

  // Create catalog
  const createCatalogMutation = useMutation({
    mutationFn: (catalogData: CreateCatalogRequest) => createCatalog(catalogData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalogs"] })
      toast({
        title: "Success",
        description: "Catalog created successfully",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to create catalog",
        variant: "destructive",
      })
    },
  })

  // Update catalog
  const updateCatalogMutation = useMutation({
    mutationFn: ({ id, ...catalogData }: { id: string } & UpdateCatalogRequest) => updateCatalog(id, catalogData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalogs"] })
      toast({
        title: "Success",
        description: "Catalog updated successfully",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to update catalog",
        variant: "destructive",
      })
    },
  })

  // Delete catalog
  const deleteCatalogMutation = useMutation({
    mutationFn: (id: string) => deleteCatalog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalogs"] })
      toast({
        title: "Success",
        description: "Catalog deleted successfully",
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to delete catalog",
        variant: "destructive",
      })
    },
  })

  return {
    catalogs,
    isLoading,
    isFetching,
    error,
    meta,
    createCatalog: createCatalogMutation,
    updateCatalog: updateCatalogMutation,
    deleteCatalog: deleteCatalogMutation,
  }
}
