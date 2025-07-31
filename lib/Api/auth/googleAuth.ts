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

// Google OAuth Configuration
const GOOGLE_CLIENT_ID = "635968216240-82pue6vqbqhpguflseef9h5hmmq92t65.apps.googleusercontent.com";
const GOOGLE_REDIRECT_URI = typeof window !== 'undefined' ? `${window.location.origin}/google-callback` : 'http://localhost:3001/google-callback';

// Function to initiate Google OAuth directly
export const initiateGoogleAuth = () => {
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${GOOGLE_CLIENT_ID}&` +
    `redirect_uri=${encodeURIComponent(GOOGLE_REDIRECT_URI)}&` +
    `response_type=code&` +
    `scope=${encodeURIComponent('email profile')}&` +
    `access_type=offline&` +
    `prompt=consent`;
  
  window.location.href = googleAuthUrl;
};

// Function to exchange authorization code for tokens
export const exchangeCodeForTokens = async (code: string): Promise<GoogleAuthResponse> => {
  try {
    const response = await fetch('/api/auth/google/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        redirect_uri: GOOGLE_REDIRECT_URI
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google token exchange failed:', response.status, errorText);
      throw new Error(`Google OAuth failed: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Google OAuth response:', data);
    return data;
  } catch (error) {
    console.error('Google OAuth error:', error);
    throw error;
  }
}; 