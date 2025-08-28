import api from "@/utils/axios";

export interface ProductTrackingDetails {
  id: string;
  productId: string;
  barCode: string;
  sku: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTrackingDetailsRequest {
  productId: string;
  barCode: string;
  sku: string;
}

export interface UpdateTrackingDetailsRequest {
  barCode?: string;
  sku?: string;
}

export interface TrackingDetailsResponse {
  data: {
    data: ProductTrackingDetails;
  };
  message: string;
  statusCode: number;
  success: boolean;
}

// Create product tracking details
export const createProductTrackingDetails = async (data: CreateTrackingDetailsRequest): Promise<TrackingDetailsResponse> => {
  try {
    const response = await api.post<TrackingDetailsResponse>("/product-tracking-details", data);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to create product tracking details");
  }
};

// Update product tracking details
export const updateProductTrackingDetails = async (id: string, data: UpdateTrackingDetailsRequest): Promise<TrackingDetailsResponse> => {
  try {
    const response = await api.put<TrackingDetailsResponse>(`/product-tracking-details/${id}`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to update product tracking details");
  }
};

// Delete product tracking details
export const deleteProductTrackingDetails = async (id: string): Promise<TrackingDetailsResponse> => {
  try {
    const response = await api.delete<TrackingDetailsResponse>(`/product-tracking-details/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to delete product tracking details");
  }
};

// Get tracking details by product ID
export const getProductTrackingDetails = async (productId: string): Promise<ProductTrackingDetails | null> => {
  try {
    const response = await api.get<TrackingDetailsResponse>(`/product-tracking-details/product/${productId}`);
    return response.data.data.data; // Handle nested data structure
  } catch (error: any) {
    // If 404, return null (no tracking details found)
    if (error?.response?.status === 404) {
      return null;
    }
    throw new Error(error?.response?.data?.message || "Failed to fetch product tracking details");
  }
};
