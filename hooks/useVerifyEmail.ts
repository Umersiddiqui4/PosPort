import { useMutation } from "@tanstack/react-query";
import api from "@/utils/axios";

interface VerifyEmailResponse {
  message: string;
  // Add more fields if needed
}

export const verifyEmail = async (token: string): Promise<VerifyEmailResponse> => {
  const response = await api.get(`/auth/email/verify?token=${token}`);
  return response.data;
};

export function useVerifyEmail() {
  return useMutation<VerifyEmailResponse, Error, string>({
    mutationFn: verifyEmail,
  });
} 