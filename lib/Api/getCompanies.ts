import api from "@/utils/axios";

interface Company {
  id: string;
  name: string;
  // Add more fields as needed
}

export interface GetCompaniesResponse {
  data: Company[];
  meta: {
    page: number;
    take: number;
    itemCount: number;
    pageCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

export const getCompanies = async (
  search: string = "",
  page: number = 1,
  take: number = 10
): Promise<GetCompaniesResponse> => {
  try {
    const params = new URLSearchParams({
      page: String(page),
      take: String(take),
      user: "false",
    });
    if (search) params.append("q", search);
    const response = await api.get<GetCompaniesResponse>(
      `https://dev-api.posport.io/api/v1/companies?${params.toString()}`
    );
    console.log("API companies response", response.data);
    // If response.data.meta exists, return it. Otherwise, construct meta from available fields.
    return {
      data: response.data.data,
      meta: response.data.meta || {
        page: 1,
        take: 10,
        itemCount: response.data.data?.length || 0,
        pageCount: 1,
        hasPreviousPage: false,
        hasNextPage: false,
      },
    };
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to fetch companies");
  }
};
