"use client"

import { Suspense } from "react"

import { Loader2 } from "lucide-react"
import Locations from "@/components/location"
import '@/styles/globals.css'

interface LocationsPageProps {
  onMobileToggle?: () => void
}

export default function LocationsPage({ onMobileToggle }: LocationsPageProps) {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-[#1a72dd]" />
          <span className="ml-2 text-lg text-gray-600">Loading locations...</span>
        </div>
      }
    >
      <Locations onMobileToggle={onMobileToggle} />
    </Suspense>
  )
}
