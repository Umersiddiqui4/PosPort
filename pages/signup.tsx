import React from 'react';
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"
import Box from '@mui/material/Box'; 
import '@/styles/globals.css'
import { useUserDataStore } from "@/lib/store"
import { useLogin } from "@/hooks/useLogin"
import { signupUser } from "@/lib/Api/auth/signUpUser"
import { useSignup } from "@/hooks/useSignUp"
import { LinearProgress } from "@mui/material"
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";

interface SignupForm {
  email: string;
  password: string;
  phone: string;
  firstName: string;
  lastName: string;
}

export default function signup() {

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  function screenChange(screen: string) {
    window.location.href = `/${screen}`;
  }

  const login = useUserDataStore((state) => state.login);
  const { mutate: signup, isPending, isSuccess, isError, error } = useSignup();
  const { toast } = useToast();

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
        window.location.href = "/login";
      }, 700);
    }
  }, [isSuccess, toast]);

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto shadow-xl border-0">
        <CardHeader className="text-center pb-4 relative">
          <button
            onClick={() => screenChange("helloScreen")}
            className="absolute left-4 top-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="text-2xl font-bold text-blue-600 mb-4">
            <h2 className=" font-extrabold ">Sign Up</h2>
          </div>
          <Label htmlFor="email" className="text-gray-700 font-medium">

            {error && (
              <span className="text-red-500 text-md">
                {" " + (error as any)?.response?.data?.error || "Login failed. Please try again."}
              </span>
            )}
          </Label>
        </CardHeader>

        <CardContent className="p-8 pt-4">


          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <Label htmlFor="firstName" className="text-gray-700 font-medium">
                First Name
              </Label>
              <Input
                id="firstName"
                name='firstName'
                type="text"
                value={form.firstName}
                onChange={handleChange}
                placeholder="Enter your first name"
                className="mt-1 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                required

              />
            </div>

            <div>
              <Label htmlFor="lastName" className="text-gray-700 font-medium">
                Last Name
              </Label>
              <Input
                id="lastName"
                name='lastName'
                value={form.lastName}
                onChange={handleChange}
                type="text"
                placeholder="Enter your last name"
                className="mt-1 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                required

              />
            </div>

            <div>
              <Label htmlFor="email" className="text-gray-700 font-medium">
                Email
              </Label>
              <Input
                id="email"
                name='email'
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="mt-1 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                required

              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-gray-700 font-medium">
                Phone Number
              </Label>
              <div className="relative mt-1">
                <PhoneInput
                  country={'pk'}
                  value={form.phone}
                  onChange={(phone: any) => setForm((prev) => ({ ...prev, phone: "+" + phone }))}
                  inputClass="!w-full !rounded-xl !border-gray-300"
                  inputProps={{
                    name: 'phone',
                    required: true,
                  }}
                />

              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-700 font-medium">
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
                  className="rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold mt-6">
              {isPending && !error ? (
                <Box sx={{ width: '60%' }}>
                  <LinearProgress color='inherit' />
                </Box>
              ) : "Sign Up"}
            </Button>
          </form>


        </CardContent>
      </Card>
    </div>
  )
}
