import { useQuery } from "@tanstack/react-query"
import { getProductById, ProductDetail } from "@/lib/Api/getProductById"

export const useProductById = (id: string, enabled = true) => {
  return useQuery<ProductDetail, Error>({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    enabled: !!id && enabled,
    retry: 1,
  })
}
