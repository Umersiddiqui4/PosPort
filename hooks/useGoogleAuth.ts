"use client";

import { useUserDataStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { initiateGoogleAuth, exchangeCodeForTokens } from "@/lib/Api/auth/googleAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const useGoogleAuth = () => {
  const loginUserData = useUserDataStore((state) => state.login);
  const { toast } = useToast();
  const router = useRouter();

  // Handle Google OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');

    if (error) {
      console.error("Google auth error:", error);
      toast({
        title: "Google Login Failed",
        description: "Authentication was cancelled or failed",
        variant: "destructive"
      });
      router.push("/login");
      return;
    }

    if (code) {
      exchangeCodeForTokens(code)
        .then((data) => {
          console.log('Google OAuth success data:', data);
          
          // Check if we have the expected data structure
          if (!data.data || !data.data.tokens || !data.data.user) {
            console.error('Invalid response structure:', data);
            throw new Error('Invalid response structure from Google OAuth');
          }
          
          // Store tokens in localStorage
          localStorage.setItem("token", data.data.tokens.access.token);
          localStorage.setItem("refreshToken", data.data.tokens.refresh.token);
          
          console.log('Tokens saved to localStorage:');
          console.log('Access token:', data.data.tokens.access.token);
          console.log('Refresh token:', data.data.tokens.refresh.token);
          
          // Update store with correct structure
          const storeData = {
            user: data.data.user,
            tokens: data.data.tokens
          };
          loginUserData(storeData);
          
          console.log('User data after login:', storeData);
          
          // Force a small delay to ensure state is updated
          setTimeout(() => {
            toast({
              title: "Google Login Successful",
              description: "Welcome back!"
            });
            
            // Redirect to dashboard
            router.push("/");
          }, 100);
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