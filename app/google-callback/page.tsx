"use client";

import { useEffect } from 'react';
// import { useGoogleAuth } from '@/hooks/useGoogleAuth'; // Unused import
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function GoogleCallbackPage() {
  // const { handleGoogleLogin } = useGoogleAuth(); // Unused variable

  useEffect(() => {
    // The useGoogleAuth hook will automatically handle the callback
    // when access and refresh tokens are present in the URL
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto shadow-xl border-0">
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">
              Completing Google Sign In...
            </h2>
            <p className="text-gray-600">
              Please wait while we complete your authentication.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}