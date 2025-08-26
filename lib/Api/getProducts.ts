import api from "@/utils/axios";

export interface Product {
  id: string;
  name: string; // Added for component compatibility
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
  attachments?: any;
}

export interface GetProductsResponse {
  items: Product[];
  message?: string;
  meta?: {
    page: number;
    take: number;
    itemCount: number;
    pageCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

export const getProducts = async (page: number = 1, take: number = 10, locationId?: string): Promise<Product[]> => {
  try {
    const params: any = { page, take: 1000 };
    if (locationId) {
      params.locationId = locationId;
    }
    
    const response = await api.get<GetProductsResponse>(
      "/products",
      {
        params,
      }
    );
    // Use items instead of data
    return (response.data.items || []).map((product: any) => ({
      attachments: product?.attachments || "/placeholder.svg",
      id: product.id,
      name: product.productName, // Map productName to name for component compatibility
      productName: product.productName,
      description: product.description || "",
      retailPrice: product.retailPrice || 0,
      image: product.image || "/placeholder.svg",
      category: product.category || "General",
      stock: product.stock || 0,
      cost: product.cost || 0,
      status: product.status || "active",
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      companyId: product.companyId,
      locationId: product.locationId,
      categoryId: product.categoryId,
    }));
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to fetch products");
  }
}; 