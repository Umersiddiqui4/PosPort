"use client"

import { Button } from "@/components/ui/button"
import React, { useCallback, useState } from "react"
import { TrendingUp, DollarSign, ShoppingBag, Users, Menu } from "lucide-react"

interface ReportPageProps {
  onMobileToggle?: () => void
  onSidebarToggle?: (collapsed: boolean) => void
}

export default function ReportPage({ onMobileToggle, onSidebarToggle }: ReportPageProps) {
  const stats = [
    { label: "Today's Sales", value: "$1,234.56", icon: DollarSign, color: "text-green-600" },
    { label: "Orders", value: "45", icon: ShoppingBag, color: "text-blue-600" },
    { label: "Customers", value: "38", icon: Users, color: "text-purple-600" },
    { label: "Growth", value: "+12%", icon: TrendingUp, color: "text-orange-600" },
  ]

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  React.useEffect(() => {
    onSidebarToggle?.(isSidebarCollapsed)
  }, [isSidebarCollapsed, onSidebarToggle])

  const handleSidebarToggle = useCallback(() => {
    setIsSidebarCollapsed((prev) => !prev)
  }, [])

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-[#f7f8fa] to-[#e8f4fd]">
      {/* Mobile Header */}
      <header className="bg-white/95 backdrop-blur-md p-3 sm:p-4 border-b border-gray-200/50 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Desktop Hamburger Menu */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSidebarToggle}
              className="hidden md:flex text-[#1a72dd] hover:bg-[#1a72dd]/10 rounded-xl transition-all duration-200"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-5 h-5" />
            </Button>

            {/* Mobile Hamburger Menu */}
            {onMobileToggle && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onMobileToggle}
                className="md:hidden text-[#1a72dd] hover:bg-[#1a72dd]/10 rounded-xl transition-all duration-200"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </Button>
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
