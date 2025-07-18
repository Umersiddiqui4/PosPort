'use client';

import { useMutation } from "@tanstack/react-query";
import { useSelector, useDispatch } from 'react-redux';
import { login, logout } from '@/lib/slices/authSlice';
import { signupUser } from "@/lib/Api/auth/signUpUser";

export const useSignup = () => {

  return useMutation({
    mutationFn: signupUser,
    onSuccess: (data, variables, context) => {
      localStorage.setItem("token", data?.data.tokens.access.token); 
      console.log("Signup successful:", data);
    },
    onError: (error) => {
      console.error("Signup failed:", error);
    }
  });
};
