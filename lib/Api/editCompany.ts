import api from "@/utils/axios";

export interface EditCompanyRequest {
  id: string;
  name?: string;
  ntn?: string;
  email?: string;
  phone?: string;
  address?: string;
  industry?: string;
  status?: string;
}

export interface EditCompanyResponse {
  data: any; // Adjust as needed
}

export const editCompany = async (data: EditCompanyRequest): Promise<EditCompanyResponse> => {
  const { id, ...update } = data;
  const response = await api.put(`/companies/${id}`, update);
  return response.data;
}; 