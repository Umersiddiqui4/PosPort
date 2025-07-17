"use client"

import { useCallback } from "react"
import { Calculator, History, FileText, Store, User, HelpCircle, RotateCcw, X, Package, Users, ArrowUpRightFromCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


interface NavbarProps {
  currentPage: string
  onPageChange: (page: string) => void
  isMobileOpen: boolean
  onMobileToggle: () => void
  isCollapsed?: boolean
}

const menuItems = [
  { id: "cashier", label: "Cashier", icon: Calculator },
  { id: "history", label: "History Transaction", icon: History },
  { id: "report", label: "Report", icon: FileText },
  // { id: "manage-store", label: "Manage Store", icon: Store },
  { id: "product-list", label: "Manage Store", icon: Package },
  { id: "customer", label: "Customers", icon: Users },
  { id: "account", label: "Account", icon: User },
  { id: "support", label: "Support", icon: HelpCircle },
] as const

export default function Navbar({
  currentPage,
  onPageChange,
  isMobileOpen,
  onMobileToggle,
  isCollapsed = false,
}: NavbarProps) {
  const handlePageChange = useCallback(
    (pageId: string) => {
        if (pageId === "auth") {
        window.location.href = "/helloScreen"
        return
      }
      onPageChange(pageId)
      // Close mobile sidebar when navigating
      if (isMobileOpen) {
        onMobileToggle()
      }
    },
    [onPageChange, isMobileOpen, onMobileToggle],
  )

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden" onClick={onMobileToggle} />
      )}

      {/* Sidebar */}
      <aside
        className={`bg-gradient-to-b from-[#1a72dd] to-[#1557b8] text-white transition-all duration-300 ease-in-out overflow-hidden fixed left-0 top-0 h-full z-50 shadow-2xl
          ${isMobileOpen ? "w-80 translate-x-0" : "w-80 -translate-x-full"} 
          ${isCollapsed ? "md:-translate-x-full lg:-translate-x-full" : "md:w-80 lg:w-80"} 
          md:translate-x-0`}
        aria-label="Main navigation"
      >
        <div className="p-6 h-full flex flex-col">
          {/* Mobile Close Button */}
          <div className="md:hidden flex justify-end mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onMobileToggle}
              className="text-white hover:bg-white/20 rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Header */}
          <header className="mb-8">
            <h1 className="text-2xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Zaib Ka Dhaba
            </h1>

            {/* Branch Selector */}
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-white/10">
              <Select defaultValue="branch1">
                <SelectTrigger className="bg-transparent border-none text-white hover:bg-white/10 transition-colors">
                  <SelectValue placeholder="Select Branch" />
                </SelectTrigger>
                <SelectContent className="bg-white border-none shadow-xl rounded-xl">
                  <SelectItem value="branch1" className="hover:bg-[#1a72dd]/10 focus:bg-[#1a72dd]/10 rounded-lg">
                    Branch 1
                  </SelectItem>
                  <SelectItem value="branch2" className="hover:bg-[#1a72dd]/10 focus:bg-[#1a72dd]/10 rounded-lg">
                    Branch 2
                  </SelectItem>
                  <SelectItem value="branch3" className="hover:bg-[#1a72dd]/10 focus:bg-[#1a72dd]/10 rounded-lg">
                    Branch 3
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </header>

          {/* Navigation Menu */}
          <nav className="space-y-2 flex-1" role="navigation" aria-label="Main menu">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = currentPage === item.id
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  onClick={() => handlePageChange(item.id)}
                  className={`w-full justify-start gap-4 p-3 h-auto rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-white/20 backdrop-blur-sm shadow-lg border border-white/20"
                      : "hover:bg-white/10 hover:backdrop-blur-sm"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className="w-6 h-6 flex-shrink-0" />
                  <span className="text-lg font-medium">{item.label}</span>
                </Button>
              )
            })}
                        <Button
              variant="ghost"
              className="w-full justify-start gap-4 p-3 h-auto rounded-xl transition-all duration-200"
              onClick={() => handlePageChange("auth")}
            >
              <ArrowUpRightFromCircle className="w-6 h-6 flex-shrink-0" />
              <span className="text-lg font-medium">Auth</span>
            </Button>
          </nav>

          {/* Last Login Section */}
          <div className="mt-8 mb-8 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10">
            <div className="flex items-start gap-3">
              <RotateCcw className="w-6 h-6 mt-1 text-blue-200" />
              <div>
                <div className="text-lg font-medium mb-1">Last Login:</div>
                <div className="text-sm opacity-90">Saturday, 23 Nov 2023</div>
                <div className="text-sm opacity-90">(02:00 AM)</div>
              </div>
            </div>
          </div>

          {/* Upgrade Button */}
          <Button
            className="w-full bg-gradient-to-r from-white to-blue-50 text-[#1a72dd] hover:from-blue-50 hover:to-white font-bold py-4 text-lg rounded-xl shadow-lg border border-white/20 transition-all duration-200 hover:scale-105"
            size="lg"
          >
            UPGRADE TO PREMIUM
          </Button>
        </div>
      </aside>
    </>
  )
}
