'use client';

import { loginUser } from "@/lib/Api/auth/loginUser";
import { useMutation } from "@tanstack/react-query";
import { useSelector, useDispatch } from 'react-redux';
import { login, logout } from '@/lib/slices/authSlice';
import { RootState } from '@/lib/store';


export const useLogin = () => {  
    // const dispatch = useDispatch();
    // const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  return useMutation({
    mutationFn: loginUser,
     onSuccess: (data, variables, context) => {
       localStorage.setItem("token", data?.data.tokens.access.token); 
      // dispatch(login());
      console.log("Login successful:", data);
      // window.location.href = "/";
    },
    onError: (error) => {
      console.error("Login failed:", error);
    }
  });
};
