import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"
import '@/styles/globals.css'


export default function signup() {

    const [showPassword, setShowPassword] = useState(false)
     const [showConfirmPassword, setShowConfirmPassword] = useState(false)

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
}
