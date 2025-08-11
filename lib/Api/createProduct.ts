import api from "@/utils/axios";

export interface CreateProductRequest {
  productName: string;
  description?: string;
  status?: "active" | "inactive" | "draft";
  uom?: string;
  cost?: number;
  retailPrice: number;
  categoryId: string;
  companyId?: string;
  locationId?: string;
  image?: string;
}

export interface CreateProductResponse {
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

export const createProduct = async (productData: CreateProductRequest): Promise<CreateProductResponse> => {
  try {
    const response = await api.post<CreateProductResponse>("/products", productData);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to create product");
  }
}; 