import api from "@/utils/axios";

export const deleteCombo = async (id: string): Promise<void> => {
  try {
    await api.delete(`/combos/${id}`);
    console.log('Combo deleted successfully:', id)
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to delete combo");
  }
};
