"use client"

import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import Users from "@/components/users"

interface UsersPageProps {
  onMobileToggle: () => void
}

export default function UsersPage({ onMobileToggle }: UsersPageProps) {
  return (
    <div className="h-full flex flex-col">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={onMobileToggle}>
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-lg font-semibold">Users</h1>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-4 sm:p-6">
          <Users />
        </div>
      </div>
    </div>
  )
}
