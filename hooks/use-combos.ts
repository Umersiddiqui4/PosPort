import { useQuery } from '@tanstack/react-query'
import api from '@/utils/axios'

export interface ComboItem {
  id: string
  createdAt: string
  updatedAt: string
  comboId: string
  productId: string
  quantity: number
  product: {
    id: string
    createdAt: string
    updatedAt: string
    productName: string
    description: string
    status: string
    uom: string
    cost: number
    retailPrice: number
    companyId: string
    locationId: string
    categoryId: string
    attachments: any[]
  }
}

export interface Combo {
  id: string
  createdAt: string
  updatedAt: string
  name: string
  description: string
  bundlePrice: number
  separatePrice: number
  shouldShowSeparatePrice: boolean
  status: string
  companyId: string
  locationId: string
  attachments: any[]
  comboItems: ComboItem[]
}

export interface ComboResponse {
  items: Combo[]
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

const fetchCombos = async (page: number = 1, take: number = 1000, locationId?: string): Promise<ComboResponse> => {
  let url = `/combos?page=${page}&take=${take}`
  
  // Add locationId filter if provided
  if (locationId) {
    url += `&locationId=${locationId}`
  }
  
  const response = await api.get<ComboResponse>(url)
  return response.data
}

export const useCombos = (page: number = 1, take: number = 1000, locationId?: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['combos', page, take, locationId],
    queryFn: () => fetchCombos(page, take, locationId),
    enabled: !!locationId, // Only fetch if locationId is provided
  })

  return {
    combos: data?.items || [],
    isLoading,
    error: error?.message || null,
    meta: data?.meta || null
  }
}
