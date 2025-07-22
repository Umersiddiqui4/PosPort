import api from "@/utils/axios";

export const deleteCompany = async (id: string): Promise<void> => {
  await api.delete(`/companies/${id}`);
}; 