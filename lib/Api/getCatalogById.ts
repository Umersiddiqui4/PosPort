import api from "@/utils/axios";

export interface Product {
  id: string;
  productName: string;
  description: string;
  cost: number;
  retailPrice: number;
  status: string;
  uom: string;
  categoryId: string;
  companyId: string;
  locationId: string;
  createdAt: string;
  updatedAt: string;
  attachments: Array<{ id: string; [key: string]: any }>;
}

export interface ProductCategory {
  id: string;
  categoryName: string;
  description: string;
  status: string;
  companyId: string;
  locationId: string;
  menuId: string;
  createdAt: string;
  updatedAt: string;
  products: Product[];
  attachments: Array<{ id: string; [key: string]: any }>;
}

export interface Catalog {
  id: string;
  name: string;
  companyId: string;
  createdAt: string;
  description: string;
  locationId: string;
  updatedAt: string;
  productCategories: ProductCategory[];
  attachments: Array<{ id: string; [key: string]: any }>;
}

export interface GetCatalogByIdResponse {
  data: Catalog;
  message: string;
  statusCode: number;
  success: boolean;
}

export const getCatalogById = async (id: string): Promise<Catalog> => {
  try {
    const response = await api.get<GetCatalogByIdResponse>(`/catalogs/${id}`);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to fetch catalog by id");
  }
};