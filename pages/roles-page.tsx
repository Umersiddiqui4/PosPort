"use client"

import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import Roles from "@/components/roles"

interface RolesPageProps {
  onMobileToggle: () => void
}

export default function RolesPage({ onMobileToggle }: RolesPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="md:hidden bg-white shadow-sm border-b">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" onClick={onMobileToggle} className="text-gray-600 hover:bg-gray-100">
            <Menu className="w-6 h-6" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900">Roles</h1>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
      </div>

      {/* Main Content */}
      <Roles />
    </div>
  )
}
