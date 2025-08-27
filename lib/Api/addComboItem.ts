import api from "@/utils/axios"

export interface AddComboItemRequest {
  productId: string
  quantity: number
}

export interface AddComboItemResponse {
  id: string
  comboId: string
  productId: string
  quantity: number
  createdAt: string
  updatedAt: string
  product: {
    id: string
    productName: string
    description: string
    retailPrice: number
    cost: number
    status: string
    uom: string
    companyId: string
    locationId: string
    categoryId: string
    attachments: any[]
  }
}

export const addComboItem = async (comboId: string, data: AddComboItemRequest): Promise<AddComboItemResponse> => {
  try {
    const requestData = {
      productId: data.productId,
      quantity: Number(data.quantity)
    }
    
    console.log('Adding combo item:', { comboId, requestData })
    
    const response = await api.post<AddComboItemResponse>(`/combos/${comboId}/items`, requestData)
    console.log('Combo item added successfully:', response.data)
    return response.data
  } catch (error: any) {
    console.error('Add combo item error:', error?.response?.data)
    throw new Error(error?.response?.data?.message || "Failed to add combo item")
  }
}
