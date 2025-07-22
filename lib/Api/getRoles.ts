import api from "@/utils/axios";

interface Role {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface GetRolesResponse {
  data: Role[];
}

export const getRoles = async (): Promise<Role[]> => {
  try {
    const response = await api.get<GetRolesResponse>(
      "/roles",
      {
        params: { page: 1, take: 10 },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to fetch roles");
  }
};
