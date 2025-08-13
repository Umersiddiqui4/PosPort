"use client";

import { useMutation } from "@tanstack/react-query";
import { googleLogin } from "@/lib/Api/auth/googleLogin";
import { useUserDataStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import type { GoogleLoginRequest } from "@/lib/Api/auth/googleLogin";

export const useGoogleLogin = () => {
  const loginUserData = useUserDataStore((state) => state.login);
  const { toast } = useToast();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: GoogleLoginRequest) => googleLogin(data),
    onSuccess: (data) => {
      // Store tokens in localStorage
      localStorage.setItem("token", data.data.tokens.access.token);
      localStorage.setItem("refreshToken", data.data.tokens.refresh.token);
      
      // Convert API response to internal format
      const internalData = {
        user: data.data.user,
        tokens: {
          access: {
            token: data.data.tokens.access.token,
            expiresIn: data.data.tokens.access.expiresIn
          },
          refresh: {
            token: data.data.tokens.refresh.token,
            expiresIn: data.data.tokens.refresh.expiresIn
          }
        }
      };
      
      // Update store
      loginUserData(internalData as any);
      
      toast({
        title: "Google Login Successful",
        description: "Welcome back!"
      });
      
      // Redirect to dashboard
      router.push("/");
    },
    onError: (error: any) => {
      console.error("Google login error:", error);
      toast({
        title: "Google Login Failed",
        description: error.response?.data?.message || "Please try again",
        variant: "destructive"
      });
    }
  });
}; 