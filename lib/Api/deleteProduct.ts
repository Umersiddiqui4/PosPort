import api from "@/utils/axios";

export const deleteProduct = async (id: string): Promise<void> => {
  try {
    await api.delete(`/products/${id}`);
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to delete product");
  }
}; 