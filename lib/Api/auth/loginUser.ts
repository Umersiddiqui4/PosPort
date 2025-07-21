"use client";

import axios from "axios";
import type { AxiosResponse } from "axios";

const BASE_URL = "https://dev-api.posport.io/api/v1";

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
  const response: AxiosResponse<LoginResponse> = await axios.post(
    `${BASE_URL}/auth/email/login`,
    JSON.stringify(data),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};
