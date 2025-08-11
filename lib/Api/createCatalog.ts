import api from "@/utils/axios";

export interface CreateCatalogRequest {
  name: string;
  description?: string;
  companyId: string;
  locationId: string;
}

export interface CreateCatalogResponse {
  data: {
    id: string;
    name: string;
    description?: string;
    companyId: string;
    locationId: string;
  };
}

export const createCatalog = async (catalog: CreateCatalogRequest): Promise<CreateCatalogResponse["data"]> => {
  try {
    const response = await api.post<CreateCatalogResponse>(
      "/catalogs",
      catalog
    );
    return response.data.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to create catalog");
  }
};