"use client"

import { Suspense } from "react"

import { ArrowLeft, Loader2, Menu } from "lucide-react"
import Locations from "@/components/location"
import '@/styles/globals.css'
import { Button } from "@/components/ui/button"


interface LocationsPageProps {
  onMobileToggle?: () => void
  onSidebarToggle?: () => void
}

export default function LocationsPage({ onMobileToggle, onSidebarToggle }: LocationsPageProps) {
  return (
   <div className="h-screen w-full overflow-hidden  bg-gray-50">
    
   
         {/* Main Content */}
         <Locations onMobileToggle={onMobileToggle}  />
       </div>
  )
}
