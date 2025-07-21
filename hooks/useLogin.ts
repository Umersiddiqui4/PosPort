'use client';

import { loginUser } from "@/lib/Api/auth/loginUser";
import { useMutation } from "@tanstack/react-query";
import api from "@/utils/axios";
import type { LoginRequest, LoginResponse } from "@/lib/Api/auth/loginUser";
import { useToast } from "@/components/ui/use-toast";

export const useLogin = () => {
  const { toast } = useToast();
  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: loginUser,
    onSuccess: (data) => {
      localStorage.setItem("token", data.data.tokens.access.token);
      localStorage.setItem("refreshToken", data.data.tokens.refresh.token);
      api.defaults.headers.common["Authorization"] = `Bearer ${data.data.tokens.access.token}`;
      // toast({ title: "Login successful", description: "You have logged in successfully." });
    },
    onError: (error) => {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
    },
  });
};
