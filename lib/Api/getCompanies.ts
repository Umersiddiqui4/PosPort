import api from "@/utils/axios";

interface Company {
  id: string;
  name: string;
  // Add more fields as needed
}

interface GetCompaniesResponse {
  data: Company[];
}

export const getCompanies = async (): Promise<Company[]> => {
  const token = localStorage.getItem("token");
  try {
    const response = await api.get<GetCompaniesResponse>("https://dev-api.posport.io/api/v1/companies?page=1&take=10&user=false", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to fetch companies");
  }
};
