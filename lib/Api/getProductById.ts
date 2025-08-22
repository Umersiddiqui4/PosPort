import api from "@/utils/axios";

export interface ProductDetail {
  id: string;
  name: string;
  productName: string;
  description?: string;
  retailPrice: number;
  price?: number;
  cost?: number;
  image?: string;
  category?: string;
  stock?: number;
  status?: "active" | "inactive" | "draft";
  createdAt?: string;
  updatedAt?: string;
  companyId?: string;
  locationId?: string;
  catalogId?: string;
  attachments?: Array<{
    id: string;
    url: string;
    filename: string;
    mimeType: string;
    size: number;
    createdAt: string;
  }>;
}

export interface GetProductByIdResponse {
  data: ProductDetail;
}

export const getProductById = async (id: string): Promise<ProductDetail> => {
  try {
    const response = await api.get<GetProductByIdResponse>(`/products/${id}`);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to fetch product by id");
  }
};
