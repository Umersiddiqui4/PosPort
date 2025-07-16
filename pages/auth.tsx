"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Smartphone, User, Building, Users, Eye, EyeOff, ArrowLeft } from "lucide-react"
import '@/styles/globals.css'
type Screen = "hello" | "login" | "login-owner" | "login-employee" | "signup"
import mobile from '@/public/mobile.png'
import login from '@/public/login.png'

import Image from "next/image"
import { useLogin } from "@/hooks/useLogin"
export default function AuthScreens() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("hello")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const { mutate, isPending, isError, error } = useLogin();




  const loginSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Call mutate with user credentials
    mutate({ email:loginEmail, password:loginPassword });
  };

  const HelloScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto shadow-xl border-0">
         <CardHeader className="text-center pb-4 relative">
              <button
                onClick={() => setCurrentScreen("hello")}
                className="absolute left-4 top-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
          <div className="mb-8">
            <div className="text-2xl flex justify-center text-blue-600 mb-2">
            <h1 className=" font-black text-blue-600 ">
              POS
            </h1>
              <span className="font-thin">PORT</span>
            </div>

          </div>
              </CardHeader>
        <CardContent className="p-8 text-center">

          <div className="mb-8">
            <div className="relative mx-auto  mb-6">
              {/* <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl transform rotate-3"></div>
              <div className="relative bg-white rounded-3xl p-6 shadow-lg border-4 border-gray-800 h-full flex flex-col items-center justify-center">
                <Smartphone className="w-16 h-16 text-blue-600 mb-4" />
                <div className="w-full space-y-2">
                  <div className="h-2 bg-blue-200 rounded"></div>
                  <div className="h-2 bg-blue-100 rounded w-3/4"></div>
                  <div className="h-2 bg-blue-100 rounded w-1/2"></div>
                </div>
              </div>
              <User className="absolute -right-4 top-8 w-12 h-12 text-blue-600 bg-white rounded-full p-2 shadow-lg" /> */}
             <Image className="w-full h- full" src={mobile} alt="My Image" />
            </div>
          </div>

          <h1 className="text-xl font-semibold text-gray-800 mb-2">Download the app for your Store</h1>
          <p className="text-gray-600 mb-8 text-sm">Manage your business efficiently with our POS system</p>

          <Button
            onClick={() => setCurrentScreen("signup")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold mb-4"
          >
            Create new account
          </Button>

          <Button
            variant="outline"
            onClick={() => setCurrentScreen("login")}
            className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 py-3 rounded-xl font-semibold"
          >
            Sign In
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  const LoginScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto shadow-xl border-0">
        <CardHeader className="text-center pb-4 relative">
              <button
                onClick={() => setCurrentScreen("hello")}
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
          
          <h2 className="text-2xl font-extrabold text-gray-800">Welcome to POSPORT!</h2>
          <p className="text-gray-600 text-sm">Select login as the owner or employee first to continue.</p>
          <div className="mb-6">
       <Image className="w-full h-full mx-auto mb-6 flex items-center justify-center" src={login} alt="Mobile Image" />
          </div>

          <div className="mt-6 space-y-3">
            <Button
              variant="outline"
              onClick={() => setCurrentScreen("login-owner")}
               className="w-full bg-blue-600 hover:bg-blue-700 text-white hover:text-white py-3 rounded-xl font-semibold mb-4"
            >
              <Building className="w-4 h-4 mr-2" />
              Login as Owner
            </Button>

            <Button
              variant="outline"
              onClick={() => setCurrentScreen("login-employee")}
               className="w-full bg-blue-600 hover:bg-blue-700 text-white hover:text-white py-3 rounded-xl font-semibold mb-4"
            >
              <Users className="w-4 h-4 mr-2" />
              Login as Employee
            </Button>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => setCurrentScreen("hello")}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Back to Home
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const LoginOwnerScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto shadow-xl border-0">
         <CardHeader className="text-center pb-4 relative">
              <button
                onClick={() => setCurrentScreen("hello")}
                className="absolute left-4 top-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
           <div className="">
            <div className="text-2xl font-extrabold flex justify-center text-blue-600 mb-2">
            Log in as Owner
            </div>

          </div>
        </CardHeader>

        <CardContent className="p-8 pt-4">
          <form onSubmit={loginSubmit} className="space-y-4">
            <div>
              <Label htmlFor="owner-email" className="text-gray-700 font-medium">
                Email
              </Label>
              <Input
                id="owner-email"
                type="email"
                value={loginEmail}
                placeholder="Enter owner email"
                onChange={(e) => setLoginEmail(e.target.value)}
                className="mt-1 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <Label htmlFor="owner-password" className="text-gray-700 font-medium">
                Password
              </Label>
              <div className="relative mt-1">
                <Input
                  id="owner-password"
                  value={loginPassword}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter owner password"
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-10"
                />

                <div className="mt-4 space-y-4">
                      <div className="">
                        <p className="text-gray-700 font-bold text-sm mb-4">Send OTP:</p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                          onClick={() => {
                            // Handle Email OTP
                            console.log("Send OTP via Email")
                          }}
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                          </svg>
                          Email
                        </Button>

                        <Button
                          variant="outline"
                          className="border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 bg-transparent"
                          onClick={() => {
                            // Handle WhatsApp OTP
                            console.log("Send OTP via WhatsApp")
                          }}
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                          </svg>
                          WhatsApp
                        </Button>

                        <Button
                          variant="outline"
                          className="border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 bg-transparent"
                          onClick={() => {
                            // Handle SMS OTP
                            console.log("Send OTP via SMS")
                          }}
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                              clipRule="evenodd"
                            />
                          </svg>
                          SMS
                        </Button>

                        <Button
                          variant="outline"
                          className="border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 bg-transparent"
                          onClick={() => {
                            // Handle Missed Call OTP
                            console.log("Send OTP via Missed Call")
                          }}
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                          </svg>
                          Missed Call
                        </Button>
                      </div>

                    </div>

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                 
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold mt-6">
              Login
            </Button>
          </form>

          <div className="mt-6 text-center" >
            <button
              onClick={() => setCurrentScreen("login")}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium underline"
            >
              Forgot Password?
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const LoginEmployeeScreen = () => (
   <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto shadow-xl border-0">
         <CardHeader className="text-center pb-4 relative">
              <button
                onClick={() => setCurrentScreen("hello")}
                className="absolute left-4 top-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
           <div className="">
            <div className="text-2xl font-extrabold flex justify-center text-blue-600 mb-2">
            Log in as Employee
            </div>

          </div>
        </CardHeader>

        <CardContent className="p-8 pt-4">
          <form className="space-y-4">
            <div>
              <Label htmlFor="owner-email" className="text-gray-700 font-medium">
                Email
              </Label>
              <Input
                id="owner-email"
                type="email"
                placeholder="Enter owner email"
                className="mt-1 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="pb-4">
              <Label htmlFor="owner-password" className="text-gray-700 font-medium">
                Password
              </Label>
              <div className="relative mt-1">
                <Input
                  id="owner-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter owner password"
                  className="rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-10"
                />

                
              </div>
            </div>

            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold mt-6">
              Login
            </Button>
          </form>

         
        </CardContent>
      </Card>
    </div>
  )

  const SignUpScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto shadow-xl border-0">
         <CardHeader className="text-center pb-4 relative">
              <button
                onClick={() => setCurrentScreen("hello")}
                className="absolute left-4 top-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
          <div className="text-2xl font-bold text-blue-600 mb-4">
          <h2 className=" font-extrabold ">Sign Up</h2>
          </div>
        </CardHeader>

        <CardContent className="p-8 pt-4">
       

          <form className="space-y-4">
           

            <div>
              <Label htmlFor="signup-email" className="text-gray-700 font-medium">
                Email
              </Label>
              <Input
                id="signup-email"
                type="email"
                placeholder="Enter your email"
                className="mt-1 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <Label htmlFor="signup-password" className="text-gray-700 font-medium">
                Phone Number
              </Label>
              <div className="relative mt-1">
                <Input
                  id="phone"
                  type="phone"
                  placeholder="Phone Number"
                  className="rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                 
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="confirm-password" className="text-gray-700 font-medium">
                 Password
              </Label>
              <div className="relative mt-1">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-10"
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

            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold mt-6">
              Sign Up
            </Button>
          </form>

    
        </CardContent>
      </Card>
    </div>
  )

  const renderScreen = () => {
    switch (currentScreen) {
      case "hello":
        return <HelloScreen />
      case "login":
        return <LoginScreen />
      case "login-owner":
        return <LoginOwnerScreen />
      case "login-employee":
        return <LoginEmployeeScreen />
      case "signup":
        return <SignUpScreen />
      default:
        return <HelloScreen />
    }
  }

  return (
    <div className="relative ">
      {renderScreen()}

      {/* Navigation for demo purposes */}
      <div className="fixed bottom-4 opacity-50 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-lg p-2 flex gap-2 z-50">
        <button
          onClick={() => setCurrentScreen("hello")}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            currentScreen === "hello" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Hello
        </button>
        <button
          onClick={() => setCurrentScreen("login")}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            currentScreen === "login" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Login
        </button>
        <button
          onClick={() => setCurrentScreen("login-owner")}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            currentScreen === "login-owner" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Owner
        </button>
        <button
          onClick={() => setCurrentScreen("login-employee")}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            currentScreen === "login-employee" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Employee
        </button>
        <button
          onClick={() => setCurrentScreen("signup")}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            currentScreen === "signup" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Sign Up
        </button>
      </div>
    </div>
  )
}
