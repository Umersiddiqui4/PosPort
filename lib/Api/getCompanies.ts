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
      `/companies?${params.toString()}`
    );
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
    // Ensure we have a proper error message string
    let errorMessage = "Failed to fetch companies";
    
    if (error?.response?.data?.message) {
      // Handle case where message might be an object
      if (typeof error.response.data.message === 'string') {
        errorMessage = error.response.data.message;
      } else if (typeof error.response.data.message === 'object') {
        errorMessage = JSON.stringify(error.response.data.message);
      }
    } else if (error?.message && typeof error.message === 'string') {
      errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
  }
};
