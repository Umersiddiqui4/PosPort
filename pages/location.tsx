"use client"

import { Suspense } from "react"

import { ArrowLeft, Loader2, Menu } from "lucide-react"
import Locations from "@/components/location"
import '@/styles/globals.css'
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";


interface LocationsPageProps {
  onMobileToggle?: () => void
  onSidebarToggle?: () => void
}

export default function LocationsPage({ onMobileToggle, onSidebarToggle }: LocationsPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const companyId = searchParams!.get("companyId");
  const showBack = !!companyId;
  return (
    <div className="h-screen w-full overflow-hidden bg-gray-50">
      <div className="flex items-center gap-4 p-4 border-b bg-white/80 sticky top-0 z-10">
        {showBack && (
          <Button variant="outline" onClick={() => router.push("/")}> 
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="hidden md:inline">Back to Companies</span>
          </Button>
        )}
        <h1 className="text-xl font-bold text-[#1a72dd]">{companyId ? "Company Locations" : "All Locations"}</h1>
      </div>
      {/* Main Content */}
      <Locations onMobileToggle={onMobileToggle} />
    </div>
  )
}
