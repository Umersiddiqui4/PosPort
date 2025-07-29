"use client";
            
import api from "@/utils/axios";

export const getUsers = async (companyId?: string) => {
  const params: any = {};
  
  // Add companyId to params if provided
  if (companyId) {
    params.companyId = companyId;
  }

  const response = await api.get(`/users`, {
    params,
  });
  return response.data;
};

export const getUserByCompanyId = async (companyId: string) => {
  const response = await api.get(`/users`, {
    params: { 
      companyId
    },
  });
  return response.data;
};

