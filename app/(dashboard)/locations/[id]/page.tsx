"use client"

import { useParams } from "next/navigation"
import Locations from "@/components/location"

export default function LocationDetailPage() {
  const params = useParams() || {}
  const locationId = (params && (params as any).id) ? (params as any).id as string : ""

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <Locations companyId={locationId} />
      </div>
    </div>
  )
}
