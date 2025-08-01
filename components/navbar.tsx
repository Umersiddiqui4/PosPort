"use client"

import { useCallback } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { useUserDataStore } from "@/lib/store";
import {
  Calculator,
  History,
  FileText,
  Store,
  User,
  HelpCircle,
  RotateCcw,
  X,
  Package,
  Users,
  Building2,
  Shield,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface NavbarProps {
  isMobileOpen: boolean
  onMobileToggle: () => void
  isCollapsed?: boolean
}

const baseMenuItems = [
  { id: "cashier", label: "Cashier", icon: Calculator, href: "/cashier"  },
  // { id: "history", label: "History Transaction", icon: History },
  // { id: "report", label: "Report", icon: FileText },
  { id: "manage-store", label: "Manage Store", icon: Store, href: "/manage-store" },
  // { id: "product-list", label: "Product List", icon: Package },
  // { id: "customer", label: "Customers", icon: Users },
  { id: "users", label: "Users", icon: User, href: "/users" },
  { id: "roles", label: "Roles", icon: Shield, href: "/roles" },
  { id: "account", label: "Account", icon: User, href: "/account" },
  { id: "support", label: "Support", icon: HelpCircle, href: "#" },
  { id: "location", label: "Location", icon: HelpCircle, href: "/companies/1/locations" },
];

export default function Navbar({ isMobileOpen, onMobileToggle, isCollapsed = false }: NavbarProps) {
  const pathname = usePathname()

  const handleLinkClick = useCallback(() => {
      // Close mobile sidebar when navigating
      if (isMobileOpen) {
        onMobileToggle()
      }
    }, [isMobileOpen, onMobileToggle])

  const user = useUserDataStore((state) => state.user);

  // Build menu items with Location logic
  let menuItems = baseMenuItems.filter((item) => {
    if (item.id === "location") {
      if (user?.role === "POSPORT_ADMIN") return false;
      return true;
    }
    return true;
  }).map((item) => {
    if (item.id === "location" && user?.role === "COMPANY_OWNER") {
      return {
        ...item,
        href: `/companies/${user.companyId}/locations`,
      };
    }
    return item;
  });

  // Always add Companies tab for POSPORT_ADMIN
  if (user?.role === "POSPORT_ADMIN") {
    menuItems = [
      ...menuItems,
      { id: "companies", label: "Companies", icon: Building2, href: "/companies" },
    ];
  }
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
          ${isCollapsed ? "md:w-0 md:translate-x-0 lg:w-0 lg:translate-x-0" : "md:w-80 lg:w-80"} 
          md:translate-x-0`}
        aria-label="Main navigation"
      >
        <div className={`p-6 h-full flex flex-col ${isCollapsed ? "md:hidden lg:hidden" : ""}`}>
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
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={handleLinkClick}
                  className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-white/20 backdrop-blur-sm shadow-lg border border-white/20"
                      : "hover:bg-white/10 hover:backdrop-blur-sm"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className="w-6 h-6 flex-shrink-0" />
                  <span className="text-lg font-medium">{item.label}</span>
                  </Link>
              )
            })}
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
