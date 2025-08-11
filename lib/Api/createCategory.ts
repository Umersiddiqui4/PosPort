// lib/Api/createCategory.ts
import api from "@/utils/axios"

export interface CreateCategoryPayload {
  categoryName: string
  description?: string
  status: "active" | "inactive"
  companyId: string
  locationId: string
  menuId: string
}

export interface CategoryResponse {
  id: string
  categoryName: string
  description?: string
  status: "active" | "inactive"
  companyId: string
  locationId: string
  menuId: string
  createdAt: string
  updatedAt: string
}

export async function createCategory(
  data: CreateCategoryPayload
): Promise<CategoryResponse> {
  console.log("api data", data);
  
  try {
    const response = await api.post("/product-categories", data)
    return response.data
  } catch (error) {
    console.error("Error creating category:", error)
    throw error
  }
}
