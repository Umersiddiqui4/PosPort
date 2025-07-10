"use client"

import { MessageCircle, Phone, Mail, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SupportPageProps {
  onMobileToggle?: () => void
}

export default function SupportPage({ onMobileToggle }: SupportPageProps) {
  const supportOptions = [
    { icon: MessageCircle, title: "Live Chat", description: "Chat with our support team", action: "Start Chat" },
    { icon: Phone, title: "Phone Support", description: "Call us at +1 (555) 123-4567", action: "Call Now" },
    { icon: Mail, title: "Email Support", description: "Send us an email", action: "Send Email" },
    { icon: FileText, title: "Help Center", description: "Browse our knowledge base", action: "View Articles" },
  ]

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
          <h1 className="text-lg font-bold text-[#1a72dd] flex-1 text-center">Support & Help</h1>
          <div className="w-10"></div>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-4 sm:p-6">
        <h1 className="text-2xl font-bold text-[#2a3256] mb-6 hidden md:block">Support & Help</h1>

        <div className="space-y-4 mb-8">
          {supportOptions.map((option, index) => {
            const Icon = option.icon
            return (
              <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Icon className="w-6 h-6 text-[#1a72dd]" />
                    <div>
                      <h3 className="font-medium text-[#2a3256]">{option.title}</h3>
                      <p className="text-sm text-[#545454] mt-1">{option.description}</p>
                    </div>
                  </div>
                  <Button variant="outline" className="text-[#1a72dd] border-[#1a72dd] bg-transparent">
                    {option.action}
                  </Button>
                </div>
              </div>
            )
          })}
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#2a3256] mb-4">Frequently Asked Questions</h2>
          <div className="space-y-3">
            <div className="border-b border-gray-200 pb-3">
              <h3 className="font-medium text-[#2a3256]">How do I add new menu items?</h3>
              <p className="text-sm text-[#545454] mt-1">Go to Manage Store and click the "Add Item" button.</p>
            </div>
            <div className="border-b border-gray-200 pb-3">
              <h3 className="font-medium text-[#2a3256]">How can I view my sales reports?</h3>
              <p className="text-sm text-[#545454] mt-1">Navigate to the Reports section to view detailed analytics.</p>
            </div>
            <div>
              <h3 className="font-medium text-[#2a3256]">How do I upgrade to premium?</h3>
              <p className="text-sm text-[#545454] mt-1">Click the "Upgrade to Premium" button in the sidebar.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
