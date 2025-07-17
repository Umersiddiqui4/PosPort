import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Building, Users, ArrowLeft } from "lucide-react"
import Image from "next/image"
import login from '@/public/login.png'
import "@/styles/globals.css"


export default function LoginPage() {

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

                    <h2 className="text-2xl font-extrabold text-gray-800">Welcome to POSPORT!</h2>
                    <p className="text-gray-600 text-sm">Select login as the owner or employee first to continue.</p>
                    <div className="mb-6">
                        <Image className="w-full h-full mx-auto mb-6 flex items-center justify-center" src={login} alt="Mobile Image" />
                    </div>

                    <div className="mt-6 space-y-3">
                        <Button
                            variant="outline"
                            onClick={() => screenChange("login-owner")}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white hover:text-white py-3 rounded-xl font-semibold mb-4"
                        >
                            <Building className="w-4 h-4 mr-2" />
                            Login as Owner
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => screenChange("login-employee")}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white hover:text-white py-3 rounded-xl font-semibold mb-4"
                        >
                            <Users className="w-4 h-4 mr-2" />
                            Login as Employee
                        </Button>
                    </div>

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => screenChange("helloScreen")}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                            Back to Home
                        </button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}