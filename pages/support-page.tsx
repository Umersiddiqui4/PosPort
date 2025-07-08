import { MessageCircle, Phone, Mail, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SupportPage() {
  const supportOptions = [
    { icon: MessageCircle, title: "Live Chat", description: "Chat with our support team", action: "Start Chat" },
    { icon: Phone, title: "Phone Support", description: "Call us at +1 (555) 123-4567", action: "Call Now" },
    { icon: Mail, title: "Email Support", description: "Send us an email", action: "Send Email" },
    { icon: FileText, title: "Help Center", description: "Browse our knowledge base", action: "View Articles" },
  ]

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#2a3256] mb-6">Support & Help</h1>

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
  )
}
