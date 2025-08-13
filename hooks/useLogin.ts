'use client';

import { loginUser } from "@/lib/Api/auth/loginUser";
import { useMutation } from "@tanstack/react-query";
import api from "@/utils/axios";
import type { LoginRequest } from "@/lib/Api/auth/loginUser";
import type { ApiLoginResponse } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { useUserDataStore } from "@/lib/store";
import { tokenManager } from "@/lib/auth/tokenManager";

export const useLogin = () => {
  const { toast } = useToast();
  const loginUserData = useUserDataStore((state) => state.login);
  return useMutation<ApiLoginResponse, Error, LoginRequest>({
    mutationFn: loginUser,
    onSuccess: (data) => {
      // Use secure token manager
      tokenManager.setTokens(
        data.data.tokens.access.token,
        data.data.tokens.refresh.token
      );
      
      // Store user data securely
      tokenManager.setUserData(data.data.user);
      
      api.defaults.headers.common["Authorization"] = `Bearer ${data.data.tokens.access.token}`;
      
      // Convert API response to internal format
      const internalData = {
        user: data.data.user,
        tokens: {
          access: {
            token: data.data.tokens.access.token,
            expiresIn: data.data.tokens.access.expires
          },
          refresh: {
            token: data.data.tokens.refresh.token,
            expiresIn: data.data.tokens.refresh.expires
          }
        }
      };
      
      loginUserData(internalData);
      toast({ title: "Login successful", description: "You have logged in successfully." });
    },
    onError: (error) => {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
    },
  });
};
