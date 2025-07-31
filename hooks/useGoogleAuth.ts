"use client";

import { useUserDataStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { initiateGoogleAuth, handleGoogleSuccess } from "@/lib/Api/auth/googleAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const useGoogleAuth = () => {
  const loginUserData = useUserDataStore((state) => state.login);
  const { toast } = useToast();
  const router = useRouter();

  // Handle Google OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('access');
    const refreshToken = urlParams.get('refresh');

    if (accessToken && refreshToken) {
      handleGoogleSuccess(accessToken, refreshToken)
        .then((data) => {
          // Store tokens in localStorage
          localStorage.setItem("token", data.data.tokens.access.token);
          localStorage.setItem("refreshToken", data.data.tokens.refresh.token);
          
          // Update store
          loginUserData(data.data);
          
          toast({
            title: "Google Login Successful",
            description: "Welcome back!"
          });
          
          // Redirect to dashboard
          router.push("/");
        })
        .catch((error) => {
          console.error("Google auth error:", error);
          toast({
            title: "Google Login Failed",
            description: "Please try again",
            variant: "destructive"
          });
          router.push("/login");
        });
    }
  }, [loginUserData, toast, router]);

  const handleGoogleLogin = () => {
    try {
      initiateGoogleAuth();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initiate Google login",
        variant: "destructive"
      });
    }
  };

  return { handleGoogleLogin };
}; 