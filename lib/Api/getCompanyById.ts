import api from "@/utils/axios";

export interface CompanyByIdResponse {
  id: string;
  name: string;
}

export const getCompanyById = async (id: string): Promise<CompanyByIdResponse> => {
  const response = await api.get(`/companies/${id}`);
  return response.data.data;
};


