import api from "@/utils/axios";

export interface ProductInventory {
  id: string;
  productId: string;
  currentStock: number;
  reservedStock: number;
  reorderLevel: number;
  minimumReorderQuantity: number;
  maxStockCapacity: number;
  costPerUnit: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateInventoryRequest {
  productId: string;
  currentStock: number;
  reservedStock: number;
  reorderLevel: number;
  minimumReorderQuantity: number;
  maxStockCapacity: number;
  costPerUnit: number;
}

export interface UpdateInventoryRequest {
  currentStock?: number;
  reservedStock?: number;
  reorderLevel?: number;
  minimumReorderQuantity?: number;
  maxStockCapacity?: number;
  costPerUnit?: number;
}

export interface UpdateStockQuantityRequest {
  quantity: number;
}

export interface InventoryResponse {
  data: {
    data: ProductInventory;
  };
  message: string;
  statusCode: number;
  success: boolean;
}

// Get inventory by product ID
export const getProductInventory = async (productId: string): Promise<ProductInventory | null> => {
  try {
    const response = await api.get<InventoryResponse>(`/product-inventory/product/${productId}`);
    return response.data.data.data; // Handle nested data structure
  } catch (error: any) {
    // If 404, return null (no inventory found)
    if (error?.response?.status === 404) {
      return null;
    }
    throw new Error(error?.response?.data?.message || "Failed to fetch product inventory");
  }
};

// Create product inventory
export const createProductInventory = async (data: CreateInventoryRequest): Promise<InventoryResponse> => {
  try {
    const response = await api.post<InventoryResponse>("/product-inventory", data);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to create product inventory");
  }
};

// Update product inventory
export const updateProductInventory = async (id: string, data: UpdateInventoryRequest): Promise<InventoryResponse> => {
  try {
    const response = await api.put<InventoryResponse>(`/product-inventory/${id}`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to update product inventory");
  }
};

// Update only stock quantity
export const updateProductStockQuantity = async (productId: string, data: UpdateStockQuantityRequest): Promise<InventoryResponse> => {
  try {
    const response = await api.put<InventoryResponse>(`/product-inventory/product/${productId}/quantity`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to update product stock quantity");
  }
};

// Delete product inventory
export const deleteProductInventory = async (id: string): Promise<InventoryResponse> => {
  try {
    const response = await api.delete<InventoryResponse>(`/product-inventory/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to delete product inventory");
  }
};
