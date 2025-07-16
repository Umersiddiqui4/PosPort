import { loginUser } from "@/lib/Api/auth/loginUser";
import { useMutation } from "@tanstack/react-query";


export const useLogin = () => {
  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      // ✅ Token ko localStorage ya cookies mein save karo
      // localStorage.setItem("token", data?.accessToken); // adjust key based on API
    },
    onError: (error) => {
      console.error("Login failed:", error);
    }
  });
};
