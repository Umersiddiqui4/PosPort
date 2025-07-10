"use client"

import { User, Mail, Phone, MapPin, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AccountPageProps {
  onMobileToggle?: () => void
}

export default function AccountPage({ onMobileToggle }: AccountPageProps) {
  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-[#f7f8fa] to-[#e8f4fd]">
      {/* Mobile Header */}
      <header className="bg-white/95 backdrop-blur-md p-3 sm:p-4 border-b border-gray-200/50 shadow-sm md:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onMobileToggle && (
              <button
                onClick={onMobileToggle}
                className="p-2 text-[#1a72dd] hover:bg-[#1a72dd]/10 rounded-xl transition-all duration-200"
                aria-label="Open menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
          </div>
          <h1 className="text-lg font-bold text-[#1a72dd] flex-1 text-center">Account Settings</h1>
          <div className="w-10"></div>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-4 sm:p-6">
        <h1 className="text-2xl font-bold text-[#2a3256] mb-6 hidden md:block">Account Settings</h1>

        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-[#1a72dd] rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#2a3256]">Restaurant Owner</h2>
              <p className="text-[#545454]">Zaib Ka Dhaba</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-[#545454]" />
              <span className="text-[#2a3256]">owner@zaibkadhaba.com</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-[#545454]" />
              <span className="text-[#2a3256]">+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-[#545454]" />
              <span className="text-[#2a3256]">123 Restaurant Street, Food City</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Button className="w-full bg-[#1a72dd] hover:bg-[#1a72dd]/90 justify-start">
            <Settings className="w-4 h-4 mr-3" />
            Edit Profile
          </Button>
          <Button variant="outline" className="w-full justify-start bg-transparent">
            Change Password
          </Button>
          <Button variant="outline" className="w-full justify-start bg-transparent">
            Notification Settings
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  )
}
