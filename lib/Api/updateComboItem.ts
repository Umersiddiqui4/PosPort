import api from "@/utils/axios"

export interface UpdateComboItemRequest {
  quantity: number
}

export interface UpdateComboItemResponse {
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

export const updateComboItem = async (comboId: string, itemId: string, data: UpdateComboItemRequest): Promise<UpdateComboItemResponse> => {
  try {
    const requestData = {
      quantity: Number(data.quantity)
    }
    
    console.log('Updating combo item:', { comboId, itemId, requestData })
    
    const response = await api.put<UpdateComboItemResponse>(`/combos/${comboId}/items/${itemId}`, requestData)
    console.log('Combo item updated successfully:', response.data)
    return response.data
  } catch (error: any) {
    console.error('Update combo item error:', error?.response?.data)
    throw new Error(error?.response?.data?.message || "Failed to update combo item")
  }
}
