"use client";

import api from "@/utils/axios";
import type { AxiosResponse } from "axios";

const BASE_URL = "https://dev-api.posport.io/api/v1";

export interface GoogleAuthResponse {
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
    };
  };
}

export interface GoogleSuccessResponse {
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
    };
  };
}

// Function to initiate Google OAuth
export const initiateGoogleAuth = () => {
  // For testing - you can change this to your actual domain
  const redirectUri = `${window.location.origin}/google-callback`;
  const googleAuthUrl = `${BASE_URL}/auth/google?redirect_uri=${encodeURIComponent(redirectUri)}`;
  console.log('Google Auth URL:', googleAuthUrl);
  window.location.href = googleAuthUrl;
};

// Function to handle Google OAuth success
export const handleGoogleSuccess = async (accessToken: string, refreshToken: string): Promise<GoogleSuccessResponse> => {
  const response: AxiosResponse<GoogleSuccessResponse> = await api.get(
    `/auth/google/success?access=${accessToken}&refresh=${refreshToken}`
  );
  return response.data;
}; 