'use client';

import { loginUser } from "@/lib/Api/auth/loginUser";
import { useMutation } from "@tanstack/react-query";
import api from "@/utils/axios";


export const useLogin = () => {

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data, variables, context) => {
      localStorage.setItem("token", data?.data.tokens.access.token);
      localStorage.setItem("refreshToken", data?.data.tokens.refresh.token);
      api.defaults.headers.common["Authorization"] = `Bearer ${data?.data.tokens.access.token}`;
      console.log("Login successful:", data);
    },
    onError: (error) => {
      console.error("Login failed:", error);
    }
  });
};
