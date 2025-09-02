"use client"

import React from 'react';
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Eye, EyeOff, ArrowLeft, Users, Shield, Zap, UserPlus } from "lucide-react"
import { Logo } from "@/components/ui/logo"
import Box from '@mui/material/Box';
import '@/styles/globals.css'
import { useSignup } from "@/hooks/useSignUp"
import { LinearProgress } from "@mui/material"
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from 'next/navigation';

interface SignupForm {
  email: string;
  password: string;
  phone: string;
  firstName: string;
  lastName: string;
}

export default function Signup() {
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { mutate: signup, isPending, isSuccess, error } = useSignup();
  const { toast } = useToast();
  const router = useRouter();

  const [form, setForm] = useState<SignupForm>({
    email: '',
    password: '',
    phone: '',
    firstName: '',
    lastName: '',
  });

  useEffect(() => {
    if (isSuccess) {
      toast({ title: "Signup successful", description: "Redirecting to login..." });
      setTimeout(() => {
        router.push("/login");
      }, 700);
    }
  }, [isSuccess, toast, router]);

  function screenChange(screen: string) {
    router.push(`/${screen}`);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signup({
      firstName: form.firstName,
      lastName: form.lastName,
      phone: form.phone,
      email: form.email,
      password: form.password,
    });
  };

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
                Join the Restaurant Revolution
              </h2>
              <p className="text-xl text-blue-100 leading-relaxed">
                Create your account and start managing your restaurant operations with our comprehensive platform designed for growth and efficiency.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <UserPlus className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Quick Setup</h3>
                  <p className="text-blue-100">Get started in minutes with our streamlined onboarding process</p>
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

      {/* Right Side - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center flex-col items-center text-center mb-8">
            <div className="mb-4">
              <Logo size="xl" variant="default" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Join the restaurant revolution with our comprehensive platform
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
                  Create Your Account
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Join PosPort and start managing your restaurant operations
                </p>
                {error && (
                  <div className="mt-2">
                    <span className="text-red-500 text-sm">
                      {`${(error as Error)?.message}` || "Signup failed. Please try again."}
                    </span>
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-8 pt-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-gray-700 dark:text-gray-300 font-medium">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      name='firstName'
                      type="text"
                      value={form.firstName}
                      onChange={handleChange}
                      placeholder="Enter your first name"
                      className="mt-1 rounded-xl border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="lastName" className="text-gray-700 dark:text-gray-300 font-medium">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      name='lastName'
                      value={form.lastName}
                      onChange={handleChange}
                      type="text"
                      placeholder="Enter your last name"
                      className="mt-1 rounded-xl border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
                      required
                    />
                  </div>
                </div>

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
                    placeholder="Enter your email"
                    className="mt-1 rounded-xl border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300 font-medium">
                    Phone Number
                  </Label>
                  <div className="relative mt-1">
                    <PhoneInput
                      country={'pk'}
                      value={form.phone}
                      onChange={(phone: string) => setForm((prev) => ({ ...prev, phone: `+${phone}` }))}
                      inputClass="!w-full !rounded-xl !border-gray-300 dark:!border-gray-600 dark:!bg-gray-700 dark:!text-gray-200"
                      inputProps={{
                        name: 'phone',
                        required: true,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="password" className="text-gray-700 dark:text-gray-300 font-medium">
                    Password
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="rounded-xl border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold mt-6 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isPending && !error ? (
                    <Box sx={{ width: '60%' }}>
                      <LinearProgress color='inherit' />
                    </Box>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      Create Account
                    </>
                  )}
                </Button>

                {/* Additional Links */}
                <div className="text-center mt-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => screenChange("login")}
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium hover:underline"
                    >
                      Sign in here
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