import api from "@/utils/axios";

export interface CreateCompanyRequest {
  name: string;
  ntn: string;
  email: string;
  phone: string;
  address: string;
  industry: string;
  status: string;
}

export interface CreateCompanyResponse {
  data: any; // Adjust as needed
}

export const createCompany = async (data: CreateCompanyRequest): Promise<CreateCompanyResponse> => {
  const response = await api.post("/companies", data);
  return response.data;
}; 