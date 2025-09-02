import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"
import Image from "next/image"
import mobile from '@/public/mobile.png'
import { ArrowRight, Download, Store, Smartphone, Zap, UserPlus, LogIn } from "lucide-react"
import "@/styles/globals.css"

export default function HelloScreen() {

  function screenChange(screen: string) {
    if (typeof window !== 'undefined') {
      window.location.href = `/${screen}`;
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex">
      {/* Left Side - Branding & Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white p-12">
        <div className="w-full flex flex-col justify-between">
          <div className="mb-8">
            <Logo size="lg" variant="white" />
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold mb-4 leading-tight">
                Welcome to PosPort
              </h2>
              <p className="text-xl text-blue-100 leading-relaxed">
                Your complete store management solution. Streamline operations, boost efficiency, and grow your business with our powerful POS system.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Store className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Complete Business Management</h3>
                  <p className="text-blue-100">Manage inventory, sales, and operations from one platform</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Smartphone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Mobile-First Design</h3>
                  <p className="text-blue-100">Access your business anywhere, anytime with our mobile app</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Lightning Fast Setup</h3>
                  <p className="text-blue-100">Get started in minutes with our streamlined onboarding</p>
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

      {/* Right Side - App Download & Actions */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center flex-col items-center text-center mb-8">
            <div className="mb-4">
              <Logo size="xl" variant="default" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Your complete store management solution
            </p>
          </div>

          <Card className="w-full shadow-2xl border-0 dark:bg-gray-800 dark:border-gray-700 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              {/* App Preview Image */}
              <div className="mb-8">
                <div className="relative mx-auto mb-6">
                  <div className="relative max-w-xs mx-auto">
                    <Image 
                      className="w-full h-auto rounded-2xl shadow-lg" 
                      src={mobile} 
                      alt="PosPort Mobile App" 
                      priority
                    />
                  </div>
                </div>
              </div>

              {/* Main Message */}
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">
                Download the PosPort App
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mb-8 text-base leading-relaxed">
                Transform your store operations with our powerful mobile POS system. 
                Manage your business efficiently from anywhere.
              </p>

              {/* Action Buttons */}
              <div className="space-y-4">
                <Button
                  onClick={() => screenChange("signup")}
                  className="w-full bg-blue-600 dark:bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-700 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-5 h-5" />
                  Create New Account
                  <ArrowRight className="w-4 h-4" />
                </Button>

                <Button
                  variant="outline"
                  onClick={() => screenChange("login")}
                  className="w-full border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 py-4 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <LogIn className="w-5 h-5" />
                  Sign In to Existing Account
                </Button>
              </div>

              {/* Additional Info */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  Available on all devices
                </p>
                <div className="flex justify-center space-x-6 text-xs text-gray-400 dark:text-gray-500">
                  <span>📱 iOS</span>
                  <span>🤖 Android</span>
                  <span>💻 Web</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}