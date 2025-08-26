import api from "@/utils/axios"

export interface CreateComboRequest {
  name: string
  description: string
  bundlePrice: number
  shouldShowSeparatePrice: boolean
  status: string
  companyId: string
  locationId: string
  productIds: string[]
  productQuantities?: Record<string, number>
}

export interface CreateComboResponse {
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

export const createCombo = async (data: CreateComboRequest): Promise<CreateComboResponse> => {
  try {
    // Prepare the request data - only send fields that the API expects
    const requestData = {
      name: data.name,
      description: data.description,
      bundlePrice: Number(data.bundlePrice), // Ensure it's a number
      shouldShowSeparatePrice: Boolean(data.shouldShowSeparatePrice), // Ensure it's a boolean
      status: data.status,
      companyId: data.companyId,
      locationId: data.locationId,
      productIds: data.productIds
    }
    
    console.log('Sending combo request:', requestData)
    console.log('Request data types:', {
      name: typeof requestData.name,
      description: typeof requestData.description,
      bundlePrice: typeof requestData.bundlePrice,
      shouldShowSeparatePrice: typeof requestData.shouldShowSeparatePrice,
      status: typeof requestData.status,
      companyId: typeof requestData.companyId,
      locationId: typeof requestData.locationId,
      productIds: Array.isArray(requestData.productIds)
    })
    
    const response = await api.post<CreateComboResponse>('/combos', requestData)
    console.log('Combo created successfully:', response.data)
    return response.data
  } catch (error: any) {
    console.error('Combo creation error:', error?.response?.data)
    console.error('Full error response:', error?.response)
    throw new Error(error?.response?.data?.message || "Failed to create combo")
  }
}
