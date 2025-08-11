import api from "@/utils/axios";

export interface Catalog {
  id: string;
  name: string;
  companyId: string;
  createdAt: string;
  description: string;
  locationId: string;
  updatedAt: string;
}

export interface GetCatalogByIdResponse {
  data: Catalog;
}

export const getCatalogById = async (id: string): Promise<Catalog> => {
  try {
    const response = await api.get<GetCatalogByIdResponse>(`/catalogs/${id}`);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to fetch catalog by id");
  }
};