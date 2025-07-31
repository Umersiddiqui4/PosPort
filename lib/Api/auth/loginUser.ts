"use client";

import api from "@/utils/axios";
import type { AxiosResponse } from "axios";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface Token {
  token: string;
  expires: string;
}

export interface LoginResponse {
  data: {
    tokens: {
      access: Token;
      refresh: Token;
    };
    user: {
      id: string;
      email: string;
      // Add more user fields as needed
    };
  };
}

export const loginUser = async (data: LoginRequest): Promise<LoginResponse> => {
  const response: AxiosResponse<LoginResponse> = await api.post(
    `/auth/email/login`,
    JSON.stringify(data),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};
