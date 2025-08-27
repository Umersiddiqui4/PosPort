import api from "@/utils/axios"

export interface UpdateComboBasicRequest {
  name: string
  description: string
  bundlePrice: number
  shouldShowSeparatePrice: boolean
  status: string
}

export interface UpdateComboBasicResponse {
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

export const updateComboBasic = async (id: string, data: UpdateComboBasicRequest): Promise<UpdateComboBasicResponse> => {
  try {
    // Prepare the request data - only send basic fields, no products
    const requestData = {
      name: data.name,
      description: data.description,
      bundlePrice: Number(data.bundlePrice), // Ensure it's a number
      shouldShowSeparatePrice: Boolean(data.shouldShowSeparatePrice), // Ensure it's a boolean
      status: data.status
    }
    
    console.log('Sending basic combo update request:', { id, requestData })
    
    const response = await api.put<UpdateComboBasicResponse>(`/combos/${id}`, requestData)
    console.log('Basic combo updated successfully:', response.data)
    return response.data
  } catch (error: any) {
    console.error('Basic combo update error:', error?.response?.data)
    throw new Error(error?.response?.data?.message || "Failed to update combo basic info")
  }
}
