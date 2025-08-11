import api from "@/utils/axios";

export interface ProductCategory {
  id: string;
  name: string;
  description: string;
  status: "active" | "inactive";
  productCount: number;
  parentId?: string;
  color: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetCategoriesResponse {
  items: ProductCategory[];
  total: number;
  page: number;
  take: number;
}

export const getCategories = async (
  page: number = 1,
  take: number = 10
): Promise<GetCategoriesResponse> => {
  const response = await api.get(`/product-categories?page=${page}&take=${take}`);
  // Assuming API returns { data: { items, total, page, take } }
  return response.data;
};
