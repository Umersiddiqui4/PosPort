'use client';

import { loginUser } from "@/lib/Api/auth/loginUser";
import { useMutation } from "@tanstack/react-query";
import { useSelector, useDispatch } from 'react-redux';
import { login, logout } from '@/lib/slices/authSlice';


export const useLogin = () => {  

  return useMutation({
    mutationFn: loginUser,
     onSuccess: (data, variables, context) => {
       localStorage.setItem("token", data?.data.tokens.access.token); 
      console.log("Login successful:", data);
    },
    onError: (error) => {
      console.error("Login failed:", error);
    }
  });
};
