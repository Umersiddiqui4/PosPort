"use client";

import api from "@/utils/axios";
import type { AxiosResponse } from "axios";

// const BASE_URL = "https://dev-api.posport.io/api/v1"; // Unused variable

export interface ChangePasswordRequest {
  password: string;
  confirmPassword: string;
  shouldLogoutAllSessions: boolean;
}

export interface ChangePasswordResponse {
  data: {
    message: string;
  };
}

export const changePassword = async (data: ChangePasswordRequest): Promise<ChangePasswordResponse> => {
  const response: AxiosResponse<ChangePasswordResponse> = await api.post(
    `/auth/password/change`,
    data
  );
  return response.data;
}; 