import api from "@/utils/axios";

export interface UpdateProductRequest {
  productName?: string;
  description?: string;
  status?: "active" | "inactive" | "draft";
  uom?: string;
  cost?: number;
  retailPrice?: number;
  categoryId?: string;
  companyId?: string;
  locationId?: string;
  image?: string;
}

export interface UpdateProductResponse {
  data: {
    id: string;
    name: string;
    description?: string;
    price: number;
    image?: string;
    category?: string;
    stock?: number;
    status?: "active" | "inactive" | "draft";
    createdAt?: string;
    updatedAt?: string;
    companyId?: string;
    locationId?: string;
    catalogId?: string;
  };
  message?: string;
}

export const updateProduct = async (id: string, productData: UpdateProductRequest): Promise<UpdateProductResponse> => {
  try {
    const response = await api.put<UpdateProductResponse>(`/products/${id}`, productData);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to update product");
  }
}; 