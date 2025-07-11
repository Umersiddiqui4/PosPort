"use client"

import { TrendingUp, DollarSign, ShoppingBag, Users } from "lucide-react"

interface ReportPageProps {
  onMobileToggle?: () => void
}

export default function ReportPage({ onMobileToggle }: ReportPageProps) {
  const stats = [
    { label: "Today's Sales", value: "$1,234.56", icon: DollarSign, color: "text-green-600" },
    { label: "Orders", value: "45", icon: ShoppingBag, color: "text-blue-600" },
    { label: "Customers", value: "38", icon: Users, color: "text-purple-600" },
    { label: "Growth", value: "+12%", icon: TrendingUp, color: "text-orange-600" },
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
          <h1 className="text-lg font-bold text-[#1a72dd] flex-1 text-center">Reports & Analytics</h1>
          <div className="w-10"></div>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-4 sm:p-6">
        <h1 className="text-2xl font-bold text-[#2a3256] mb-6 hidden md:block">Reports & Analytics</h1>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                  <div>
                    <div className="text-sm text-[#545454]">{stat.label}</div>
                    <div className="text-xl font-bold text-[#2a3256]">{stat.value}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#2a3256] mb-4">Sales Overview</h2>
          <div className="h-48 bg-[#f7f8fa] rounded-lg flex items-center justify-center">
            <p className="text-[#545454]">Chart visualization would go here</p>
          </div>
        </div>
      </div>
    </div>
  )
}
