import api from "@/utils/axios";

export interface UpdateCatalogRequest {
  name?: string;
  // Add other catalog fields as needed
}

export interface UpdateCatalogResponse {
  data: {
    id: string;
    name: string;
    // Add other catalog fields as needed
  };
}

export const updateCatalog = async (id: string, catalog: UpdateCatalogRequest): Promise<UpdateCatalogResponse["data"]> => {
  console.log('Catalog:', catalog)
  console.log('Id:', id)
  try {
    const response = await api.put<UpdateCatalogResponse>(
      `/catalogs/${id}`,
      catalog
    );
    return response.data.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to update catalog");
  }
};