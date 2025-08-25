import api from "@/utils/axios";

export interface Catalog {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  companyId?: string;
  locationId?: string;
  // UI-required fields with defaults
  status?: "active" | "inactive" | "draft";
  itemCount?: number;
  category?: string;
}

export interface GetCatalogsResponse {
  items: Catalog[];
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

export const getCatalogs = async (
  page: number = 1,
  take: number = 10,
  search: string = ""
): Promise<GetCatalogsResponse> => {
  try {
    const response = await api.get<GetCatalogsResponse>("/catalogs", {
      params: { page, take, q: search || undefined },
    });
    const items = (response.data.items || []).map((catalog: any) => ({
      id: catalog.id,
      name: catalog.name,
      description: catalog.description || "",
      createdAt: catalog.createdAt,
      updatedAt: catalog.updatedAt,
      companyId: catalog.companyId,
      locationId: catalog.locationId,
      status: catalog.status || "active",
      itemCount: catalog.itemCount || 0,
      category: catalog.category || "General",
    }));
    const meta = response.data.meta || {
      page,
      take,
      itemCount: items.length,
      pageCount: Math.max(1, Math.ceil(items.length / take)),
      hasPreviousPage: page > 1,
      hasNextPage: false,
    };
    return { items, meta };
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to fetch catalogs");
  }
};