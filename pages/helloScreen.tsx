import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import mobile from '@/public/mobile.png'
import "@/styles/globals.css"


export default function HelloScreen() {

  function screenChange(screen: string) {
    window.location.href = `/${screen}`;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto shadow-xl border-0 dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="text-center pb-4 relative">

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
              <Image className="w-full h- full" src={mobile} alt="My Image" />
            </div>
          </div>

          <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Download the app for your Store</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8 text-sm">Manage your business efficiently with our POS system</p>

          <Button
            onClick={() => screenChange("signup")}
            className="w-full bg-blue-600 dark:bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-700 text-white py-3 rounded-xl font-semibold mb-4"
          >
            Create new account
          </Button>

          <Button
            variant="outline"
            onClick={() => screenChange("login")}
            className="w-full border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 py-3 rounded-xl font-semibold"
          >
            Sign In
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}