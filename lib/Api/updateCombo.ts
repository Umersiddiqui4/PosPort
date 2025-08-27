import api from "@/utils/axios"
import { Combo } from "@/hooks/use-combos"

export interface UpdateComboRequest {
  name: string
  description: string
  bundlePrice: number
  shouldShowSeparatePrice: boolean
  status: string
  products: Array<{
    productId: string
    quantity: number
  }>
}

export interface UpdateComboResponse {
  id: string
  name: string
  description: string
  bundlePrice: number
  separatePrice: number
  shouldShowSeparatePrice: boolean
  status: string
  companyId: string
  locationId: string
  createdAt: string
  updatedAt: string
  comboItems: any[]
}

export const updateCombo = async (id: string, data: UpdateComboRequest): Promise<UpdateComboResponse> => {
  try {
    // Prepare the request data - only send fields that the API expects
    const requestData = {
      name: data.name,
      description: data.description,
      bundlePrice: Number(data.bundlePrice), // Ensure it's a number
      shouldShowSeparatePrice: Boolean(data.shouldShowSeparatePrice), // Ensure it's a boolean
      status: data.status,
      products: data.products
    }
    
    console.log('Sending combo update request:', { id, requestData })
    console.log('Request data types:', {
      name: typeof requestData.name,
      description: typeof requestData.description,
      bundlePrice: typeof requestData.bundlePrice,
      shouldShowSeparatePrice: typeof requestData.shouldShowSeparatePrice,
      status: typeof requestData.status,
      products: Array.isArray(requestData.products)
    })
    
    const response = await api.put<UpdateComboResponse>(`/combos/${id}`, requestData)
    console.log('Combo updated successfully:', response.data)
    return response.data
  } catch (error: any) {
    console.error('Combo update error:', error?.response?.data)
    console.error('Full error response:', error?.response)
    throw new Error(error?.response?.data?.message || "Failed to update combo")
  }
}
