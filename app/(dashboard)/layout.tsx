"use client"

import type React from "react"

import { useState } from "react"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const handleMobileToggle = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen)
  }

  const handleSidebarToggle = (collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed)
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#f7f8fa] to-[#e8f4fd] overflow-hidden">
      <Navbar isMobileOpen={isMobileSidebarOpen} onMobileToggle={handleMobileToggle} isCollapsed={isSidebarCollapsed} />

      {/* Main Content */}
      <main
        className={`flex-1 transition-all duration-300 ease-in-out overflow-hidden ${
          isSidebarCollapsed ? "md:ml-0 lg:ml-0" : "md:ml-80 lg:ml-80"
        }`}
        role="main"
      >
        {/* Mobile Hamburger Menu Button */}
        <div className="fixed top-4 left-4 z-50 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleMobileToggle}
            className="bg-white/90 backdrop-blur-sm shadow-lg border border-gray-200 hover:bg-white text-gray-700 hover:text-gray-900 rounded-full w-10 h-10"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>

        {/* Desktop Hamburger Button */}
        <div className="hidden md:block fixed top-4 left-4 z-50">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="bg-white/90 backdrop-blur-sm shadow-lg border border-gray-200 hover:bg-white text-gray-700 hover:text-gray-900 rounded-full w-10 h-10"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>

        <div className="h-full">{children}</div>
      </main>
    </div>
  )
}
