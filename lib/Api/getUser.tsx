"use client";
            
import api from "@/utils/axios";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  companyId?: string;
  createdAt: string;
  updatedAt: string;
}

export const getUser = async (userId?: string): Promise<User> => {
  try {
    if (userId) {
      const response = await api.get(`/users/${userId}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data.data;
    } else {
      const response = await api.get(`/users`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data.data;
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch user";
    throw new Error(errorMessage);
  }
};

export const getUserByCompanyId = async (companyId: string) => {
  const response = await api.get(`/users`, {
    params: { 
      companyId,
      active: false,
    },
  });
  return response.data;
};

