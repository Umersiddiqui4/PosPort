"use client"

import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import Catalogs from "@/components/catalogs"

interface CatalogsPageProps {
  onMobileToggle: () => void
}

export default function CatalogsPage({ onMobileToggle }: CatalogsPageProps) {
  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-[#f7f8fa] to-[#e8f4fd]">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <Button variant="ghost" size="icon" onClick={onMobileToggle} className="text-gray-600">
          <Menu className="w-6 h-6" />
        </Button>
        <h1 className="text-lg font-semibold text-gray-900">Catalogs</h1>
        <div className="w-10" /> {/* Spacer for centering */}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <Catalogs />
      </div>
    </div>
  )
}
