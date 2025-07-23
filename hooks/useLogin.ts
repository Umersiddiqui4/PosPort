'use client';

import { loginUser } from "@/lib/Api/auth/loginUser";
import { useMutation } from "@tanstack/react-query";
import api from "@/utils/axios";
import type { LoginRequest, LoginResponse } from "@/lib/Api/auth/loginUser";
import { useToast } from "@/components/ui/use-toast";
import { useUserDataStore } from "@/lib/store";

export const useLogin = () => {
  const { toast } = useToast();
  const loginUserData = useUserDataStore((state) => state.login);
  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: loginUser,
    onSuccess: (data, variables) => {
      localStorage.setItem("token", data.data.tokens.access.token);
      localStorage.setItem("refreshToken", data.data.tokens.refresh.token);
      console.log("data.data", data.data);
      
      api.defaults.headers.common["Authorization"] = `Bearer ${data.data.tokens.access.token}`;
      loginUserData(data.data); // Save full login response in Zustand
      toast({ title: "Login successful", description: "You have logged in successfully." });
    },
    onError: (error) => {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
    },
  });
};
