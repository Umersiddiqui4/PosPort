"use client"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import "/styles/globals.css"

export default function EmailVerified() {
 
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md text-center space-y-6 bg-white rounded-lg shadow-lg p-8 sm:p-10 md:p-12">
        <div className="space-y-4 mb-4">
        <CheckCircle className="mx-auto h-20 w-20 text-blue-500" />
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Email Verified!</h1>
        <p className="text-lg text-gray-600 ">
          Your email has been successfully verified. You can now log in to access your dashboard.
        </p>
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
