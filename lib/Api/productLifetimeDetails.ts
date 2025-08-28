import api from "@/utils/axios";

export interface ProductLifetimeDetails {
  id: string;
  productId: string;
  expiry: string;
  shelfLife: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateLifetimeDetailsRequest {
  productId: string;
  expiry: string;
  shelfLife: string;
}

export interface UpdateLifetimeDetailsRequest {
  expiry?: string;
  shelfLife?: string;
}

export interface LifetimeDetailsResponse {
  data: {
    data: ProductLifetimeDetails;
  };
  message: string;
  statusCode: number;
  success: boolean;
}

// Create product lifetime details
export const createProductLifetimeDetails = async (data: CreateLifetimeDetailsRequest): Promise<LifetimeDetailsResponse> => {
  try {
    const response = await api.post<LifetimeDetailsResponse>("/product-lifetime-details", data);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to create product lifetime details");
  }
};

// Update product lifetime details
export const updateProductLifetimeDetails = async (id: string, data: UpdateLifetimeDetailsRequest): Promise<LifetimeDetailsResponse> => {
  try {
    const response = await api.put<LifetimeDetailsResponse>(`/product-lifetime-details/${id}`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to update product lifetime details");
  }
};

// Delete product lifetime details
export const deleteProductLifetimeDetails = async (id: string): Promise<LifetimeDetailsResponse> => {
  try {
    const response = await api.delete<LifetimeDetailsResponse>(`/product-lifetime-details/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to delete product lifetime details");
  }
};

// Get lifetime details by product ID
export const getProductLifetimeDetails = async (productId: string): Promise<ProductLifetimeDetails | null> => {
  try {
    const response = await api.get<LifetimeDetailsResponse>(`/product-lifetime-details/product/${productId}`);
    return response.data.data.data; // Handle nested data structure
  } catch (error: any) {
    // If 404, return null (no lifetime details found)
    if (error?.response?.status === 404) {
      return null;
    }
    throw new Error(error?.response?.data?.message || "Failed to fetch product lifetime details");
  }
};
