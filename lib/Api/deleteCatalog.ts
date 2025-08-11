import api from "@/utils/axios";

export const deleteCatalog = async (id: string): Promise<void> => {
  try {
    await api.delete(`/catalogs/${id}`);
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to delete catalog");
  }
};