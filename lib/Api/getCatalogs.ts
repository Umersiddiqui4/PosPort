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

export const getCatalogs = async (page: number = 1, take: number = 10): Promise<Catalog[]> => {
  try {
    const response = await api.get<GetCatalogsResponse>(
      "/catalogs",
      {
        params: { page, take },
      }
    );
    // Use items instead of data
    return (response.data.items || []).map((catalog: any) => ({
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
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to fetch catalogs");
  }
};