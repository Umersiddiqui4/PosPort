// lib/Api/useCatalogById.ts
import { useQuery } from "@tanstack/react-query"
import { getCatalogById, Catalog } from "@/lib/Api/getCatalogById"

export const useCatalogById = (id: string, enabled = true) => {
  return useQuery<Catalog, Error>({
    queryKey: ["catalog", id],
    queryFn: () => getCatalogById(id),
    enabled: !!id && enabled, // Prevents auto-fetch if ID is empty or disabled
    retry: 1, // Optional: limits retry attempts
  })
}
