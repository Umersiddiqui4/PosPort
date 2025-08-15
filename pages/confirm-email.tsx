"use client"
import { useEffect } from "react";
import { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import "/styles/globals.css"
import { useVerifyEmail } from "@/hooks/useVerifyEmail";

export default function EmailVerified() {
  const [token, setToken] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");
  const { mutate, isPending, isSuccess, isError } = useVerifyEmail();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("hash") || urlParams.get("token");
    setToken(tokenFromUrl);
    if (tokenFromUrl) {
      mutate(tokenFromUrl, {
        onSuccess: (data) => {
          setMessage(data.message || "Your email has been successfully verified. You can now log in to access your dashboard.");
        },
        onError: (err: any) => {
          setMessage(err?.response?.data?.message || "Verification failed. Please try again or contact support.");
        },
      });
    } else {
      setMessage("No token found in URL.");
    }
  }, [mutate]);

  let status: 'pending' | 'success' | 'error' = 'pending';
  if (isPending) status = 'pending';
  else if (isSuccess) status = 'success';
  else if (isError || !token) status = 'error';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md text-center space-y-6 bg-white rounded-lg shadow-lg p-8 sm:p-10 md:p-12">
        <div className="space-y-4 mb-4">
          {status === "pending" && <div className="text-lg text-gray-600">Verifying your email...</div>}
          {status === "success" && <CheckCircle className="mx-auto h-20 w-20 text-blue-500" />}
          {status === "error" && <XCircle className="mx-auto h-20 w-20 text-red-500" />}
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            {status === "success" ? "Email Verified!" : status === "error" ? "Verification Failed" : ""}
          </h1>
          <p className="text-lg text-gray-600 ">{message}</p>
        </div>
        <Link href="/login" passHref>
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg rounded-md transition-colors duration-200">
            Go to Login
          </Button>
        </Link>
      </div>
    </div>
  )
}
