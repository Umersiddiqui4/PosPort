"use client"

import type React from "react"

import { useState } from "react"
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
        <div className="h-full">{children}</div>
      </main>
    </div>
  )
}
