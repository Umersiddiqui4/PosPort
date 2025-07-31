"use client";

import api from "@/utils/axios";
import type { AxiosResponse } from "axios";

export interface GoogleLoginRequest {
  googleId: string;
  email: string;
  firstName: string;
  lastName: string;
  picture?: string;
  accessToken: string;
  refreshToken: string;
}

export interface GoogleLoginResponse {
  data: {
    tokens: {
      access: { token: string; expiresIn: string };
      refresh: { token: string; expiresIn: string };
    };
    user: {
      id: string;
      email: string;
      firstName?: string;
      lastName?: string;
      role?: string;
      companyId?: string;
      phone?: string;
    };
  };
}

export const googleLogin = async (data: GoogleLoginRequest): Promise<GoogleLoginResponse> => {
  const response: AxiosResponse<GoogleLoginResponse> = await api.post(
    `/auth/google/login`,
    data
  );
  return response.data;
}; 