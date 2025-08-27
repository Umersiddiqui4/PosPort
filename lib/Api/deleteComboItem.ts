import api from "@/utils/axios"

export const deleteComboItem = async (comboId: string, itemId: string): Promise<void> => {
  try {
    console.log('Deleting combo item:', { comboId, itemId })
    
    await api.delete(`/combos/${comboId}/items/${itemId}`)
    console.log('Combo item deleted successfully')
  } catch (error: any) {
    console.error('Delete combo item error:', error?.response?.data)
    throw new Error(error?.response?.data?.message || "Failed to delete combo item")
  }
}
