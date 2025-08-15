"use client"

import { useState } from "react"
import Locations from "@/components/location"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface LocationsPageProps {
  onSidebarToggle?: (collapsed: boolean) => void
}

export default function LocationsPage({ onSidebarToggle: _onSidebarToggle }: LocationsPageProps) {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)

  return selectedLocation ? (
    <div className="h-full w-full bg-gray-50 dark:bg-gray-900">
      <div className="flex items-center gap-4 p-4 border-b bg-white/80 dark:bg-gray-800/80 sticky top-0 z-10 mt-16 md:mt-16">
        <Button variant="outline" onClick={() => setSelectedLocation(null)} className="dark:border-gray-600 dark:text-gray-300">
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span className="hidden md:inline">Back to Locations</span>
        </Button>
        <h1 className="text-xl font-bold text-[#1a72dd] dark:text-blue-400">Location Details</h1>
      </div>
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4 dark:text-gray-100">Location: {selectedLocation}</h2>
        {/* Add location detail content here */}
      </div>
    </div>
  ) : (
    <div className="mt-16 md:mt-16">
      <Locations companyId="1" />
    </div>
  )
}
