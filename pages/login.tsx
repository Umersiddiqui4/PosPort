
import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import '@/styles/globals.css'
import { useLogin } from '@/hooks/useLogin';
import { useAuthStore } from '@/lib/store';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';


export default function LoginEmployeePage() {
  const login = useAuthStore((state) => state.login);
  const { mutate, data, isSuccess, error, isPending } = useLogin()

  if (isSuccess) {
    login(); 
    console.log("Login successful:", data);
    window.location.href = "/";
  }

  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  console.log('Form State:', form);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    const { name, value } = e.target;
    setForm((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ email: form.email, password: form.password });
  };

  function screenChange(screen: string) {
    window.location.href = `/${screen}`;
  }


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
          <div className="">
            <div className="text-2xl font-extrabold flex justify-center text-blue-600 mb-2">
              Log In
            </div>

          </div>
        </CardHeader>

        <CardContent className="p-8 pt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-gray-700 font-medium">
                Email
                {error && (
                  <span className="text-red-500 text-sm">
                    {" " + (error as any)?.response?.data?.message || "Login failed. Please try again."}
                  </span>
                )}
              </Label>
              <Input
                id="email"
                name='email'
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                className="mt-1 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="pb-4">
              <Label htmlFor="password" className="text-gray-700 font-medium">
                Password
              </Label>
              {/* <div className="relative mt-1"> */}
              <Input
                id="password"
                name="password"
                type="password"
                value={form.password}
                required
                onChange={handleChange}
                placeholder="Enter password"
                className="rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-10"
              />


              {/* </div> */}
            </div>
     <Button
  disabled={isPending}
  type="submit"
  className="w-full bg-blue-600 hover:bg-blue-700 align-middle text-white py-3 rounded-xl font-semibold mt-6 flex items-center justify-center gap-2"
>
  {isPending && !error ? (
    <Box sx={{ width: '60%' }}>
      <LinearProgress color='inherit' />
    </Box> 
  ): "Login"}
  
</Button>
          </form>


        </CardContent>
      </Card>
    </div>
  )
}