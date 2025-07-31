"use client"

import { Mail, Phone, MessageCircle, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function SupportPage() {
  return (
    <div className="h-full flex flex-col">
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-4 sm:p-6 mt-16 md:mt-16">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center space-y-4">
              <h1 className="text-3xl font-bold text-[#1a72dd]">Support Center</h1>
              <p className="text-gray-600 text-lg">We're here to help you with any questions or issues</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <Mail className="w-8 h-8 mx-auto text-[#1a72dd] mb-2" />
                  <CardTitle className="text-lg">Email Support</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 mb-4">Get help via email</p>
                  <Button className="w-full bg-[#1a72dd] hover:bg-[#1557b8]">
                    Send Email
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <Phone className="w-8 h-8 mx-auto text-[#1a72dd] mb-2" />
                  <CardTitle className="text-lg">Phone Support</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 mb-4">Call us directly</p>
                  <Button className="w-full bg-[#1a72dd] hover:bg-[#1557b8]">
                    Call Now
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <MessageCircle className="w-8 h-8 mx-auto text-[#1a72dd] mb-2" />
                  <CardTitle className="text-lg">Live Chat</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 mb-4">Chat with our team</p>
                  <Button className="w-full bg-[#1a72dd] hover:bg-[#1557b8]">
                    Start Chat
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <Clock className="w-8 h-8 mx-auto text-[#1a72dd] mb-2" />
                  <CardTitle className="text-lg">FAQ</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 mb-4">Find quick answers</p>
                  <Button className="w-full bg-[#1a72dd] hover:bg-[#1557b8]">
                    Browse FAQ
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-[#1a72dd]">Email</h3>
                    <p className="text-gray-600">support@zaibkadhaba.com</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1a72dd]">Phone</h3>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1a72dd]">Hours</h3>
                    <p className="text-gray-600">Mon-Fri: 9AM-6PM</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1a72dd]">Response Time</h3>
                    <p className="text-gray-600">Within 24 hours</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
