// @/lib/Api/auth/signupUser.ts

import axios from "axios";

const BASE_URL = "https://dev-api.posport.io/api/v1";

export interface SignupRequest {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
}

export interface SignupResponse {
  data: {
    tokens: {
      access: { token: string; expires: string };
      refresh: { token: string; expires: string };
    };
    user: {
      id: string;
      email: string;
      // Add more user fields as needed
    };
  };
}

export const signupUser = async (data: SignupRequest): Promise<SignupResponse> => {
  const response = await axios.post(`${BASE_URL}/auth/email/signup`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
