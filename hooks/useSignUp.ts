'use client';

import { useMutation } from "@tanstack/react-query";
import { useSelector, useDispatch } from 'react-redux';
import { login, logout } from '@/lib/slices/authSlice';
import { signupUser } from "@/lib/Api/auth/signUpUser";
import { useToast } from "@/components/ui/use-toast";

type SignupRequest = Parameters<typeof signupUser>[0];
type SignupResponse = Awaited<ReturnType<typeof signupUser>>;

export const useSignup = () => {
  const { toast } = useToast();
  return useMutation<SignupResponse, Error, SignupRequest>({
    mutationFn: signupUser,
    onSuccess: (data) => {
      localStorage.setItem("token", data.data.tokens.access.token);
      toast({ title: "Signup successful", description: "Account created successfully." });
    },
    onError: (error) => {
      toast({ title: "Signup failed", description: error.message, variant: "destructive" });
    },
  });
};
