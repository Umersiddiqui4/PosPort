// lib/Api/deleteCategory.ts
import api from "@/utils/axios"

export async function deleteCategory(id: string): Promise<void> {
  try {
    await api.delete(`/product-categories/${id}`)
  } catch (error) {
    console.error("Error deleting category:", error)
    throw error
  }
}
