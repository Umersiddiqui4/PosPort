"use client"

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ArrowLeft, Users, Shield, Zap } from "lucide-react"
import { Logo } from "@/components/ui/logo"
import '@/styles/globals.css'
import { useLogin } from '@/hooks/useLogin';
import { useUserDataStore } from "@/lib/store";
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { useToast } from "@/components/ui/use-toast";
import { useGoogleAuth } from '@/hooks/useGoogleAuth';
import { useRouter } from 'next/navigation';

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginEmployeePage() {
  const login = useUserDataStore((state) => state.login);
  const { mutate, data, isSuccess, error, isPending } = useLogin();
  const { toast } = useToast();
  const { handleGoogleLogin } = useGoogleAuth();
  const router = useRouter();
  const [form, setForm] = useState<LoginForm>({
    email: '',
    password: '',
  });

  console.log(login, "login");

  useEffect(() => {
    if (isSuccess && data) {
      // Convert API response to internal format
      const internalData = {
        user: data.data.user,
        tokens: {
          access: {
            token: data.data.tokens.access.token,
            expiresIn: data.data.tokens.access.expires
          },
          refresh: {
            token: data.data.tokens.refresh.token,
            expiresIn: data.data.tokens.refresh.expires
          }
        }
      };

      login(internalData);
      toast({ title: "Login successful", description: "Redirecting..." });
      setTimeout(() => {
        router.push("/");
      }, 700);
    }
  }, [isSuccess, login, toast, data, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ email: form.email, password: form.password });
  };

  function screenChange(screen: string) {
    router.push(`/${screen}`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white p-12">
        <div className="w-full flex flex-col justify-between">
          <div className="mb-8">
            <Logo size="lg" variant="white" />
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold mb-4 leading-tight">
                Streamline Your Restaurant Operations
              </h2>
              <p className="text-xl text-blue-100 leading-relaxed">
                Manage inventory, track sales, and grow your business with our comprehensive restaurant management platform.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Multi-Location Support</h3>
                  <p className="text-blue-100">Manage multiple restaurants from one dashboard</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Secure & Reliable</h3>
                  <p className="text-blue-100">Enterprise-grade security for your business data</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Lightning Fast</h3>
                  <p className="text-blue-100">Optimized performance for smooth operations</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center text-blue-100">
            <p className="text-sm">© 2024 PosPort. All rights reserved.</p>
            <p className="text-xs mt-1">Created by Umer Siddiqui</p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center flex-col items-center text-center mb-8">
            <div className="mb-4">
              <Logo size="xl" variant="default" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Streamline your restaurant operations with our comprehensive platform
            </p>
          </div>

          <Card className="w-full shadow-2xl border-0 dark:bg-gray-800 dark:border-gray-700 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-4 relative">
              <button
                onClick={() => screenChange("helloScreen")}
                className="absolute left-4 top-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
              <div className="pt-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Welcome Back
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Sign in to your PosPort account
                </p>
              </div>
            </CardHeader>

            <CardContent className="p-8 pt-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name='email'
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                    className="mt-1 rounded-xl border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
                  />
                  {error && (
                    <p className="text-red-500 text-sm mt-1">
                      {`${(error as any)?.response?.data?.message}` || "Login failed. Please try again."}
                    </p>
                  )}
                </div>

                <div className="pb-4">
                  <Label htmlFor="password" className="text-gray-700 dark:text-gray-300 font-medium">
                    Password
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={form.password}
                    required
                    onChange={handleChange}
                    placeholder="Enter password"
                    className="rounded-xl border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 pr-10"
                  />
                </div>

                <Button
                  disabled={isPending}
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 align-middle text-white py-3 rounded-xl font-semibold mt-6 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isPending && !error ? (
                    <Box sx={{ width: '60%' }}>
                      <LinearProgress color='inherit' />
                    </Box>
                  ) : (
                    <>
                      <Shield className="w-4 h-4" />
                      Sign In
                    </>
                  )}
                </Button>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300 dark:border-gray-600" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">Or continue with</span>
                  </div>
                </div>

                {/* Google Login Button */}
                <Button
                  type="button"
                  onClick={handleGoogleLogin}
                  variant="outline"
                  className="w-full border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </Button>

                {/* Additional Links */}
                <div className="text-center mt-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => screenChange("signup")}
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium hover:underline"
                    >
                      Sign up here
                    </button>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}