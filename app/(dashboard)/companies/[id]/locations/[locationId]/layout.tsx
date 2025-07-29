"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter, usePathname } from "next/navigation"
import { ArrowLeft, Building2, Users, Monitor, Loader2, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLocationById } from "@/hooks/useLocation"

export default function LocationLayout({ children }: { children: React.ReactNode }) {
  const params = useParams()
  const router = useRouter()
  const pathname = usePathname()
console.log(params, "params");

  const companyId = params?.id as string
  const locationId = params?.locationId as string

  // Determine active tab from URL
  const getActiveTab = () => {
    if (pathname?.includes("/user")) return "users"
    if (pathname?.includes("/device")) return "devices"
    return "location"
  }

  const [activeTab, setActiveTab] = useState(getActiveTab())

  // Update active tab when pathname changes
  useEffect(() => {
    setActiveTab(getActiveTab())
  }, [pathname])

  // Fetch the specific location by ID
  const { data: locationData, isLoading, error } = useLocationById(locationId)
  const local: any = locationData
  const location: any = local?.data

  const getBrandFromName = (name?: string) => {
    if (!name) return { name: "Other", color: "bg-gray-100 text-gray-800" }
    if (name.includes("Pizza Palace")) return { name: "Pizza Palace", color: "bg-red-100 text-red-800" }
    if (name.includes("Burger Bistro")) return { name: "Burger Bistro", color: "bg-orange-100 text-orange-800" }
    if (name.includes("Sushi Central")) return { name: "Sushi Central", color: "bg-green-100 text-green-800" }
    return { name: "Other", color: "bg-gray-100 text-gray-800" }
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)

    // Navigate to the appropriate URL based on tab selection
    const baseUrl = `/companies/${companyId}/locations/${locationId}`
    switch (value) {
      case "location":
        router.push(`${baseUrl}/locationDetail`)
        break
      case "users":
        router.push(`${baseUrl}/user`)
        break
      case "devices":
        router.push(`${baseUrl}/device`)
        break
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#1a72dd]" />
        <span className="ml-2 text-gray-600">Loading location details...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-600 mb-4">Error loading location details</div>
          <Button onClick={() => router.push("/locations")} variant="outline">
            Back to Locations
          </Button>
        </div>
      </div>
    )
  }

  if (!location) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Location not found</h3>
          <p className="text-gray-600 mb-4">The location you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => router.push("/locations")} variant="outline">
            Back to Locations
          </Button>
        </div>
      </div>
    )
  }

  const brand = getBrandFromName(location.locationName)

  return (
    <div className="p-4 md:p-6 space-y-6 h-screen overflow-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/locations")}
          className="text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Location Management</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage location details, users, and devices</p>
        </div>
      </div>

      {/* Location Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#1a72dd]/10 rounded-xl flex items-center justify-center">
              <Building2 className="w-8 h-8 text-[#1a72dd]" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900 mb-2">{location.locationName}</CardTitle>
              <Badge className={brand.color}>{brand.name}</Badge>
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{location.address}</span>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Navigation Tabs */}
      <Card>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-3 rounded-none border-b bg-transparent h-auto p-0">
              <TabsTrigger
                value="location"
                className="flex items-center gap-2 py-4 px-6 rounded-none border-b-2 border-transparent data-[state=active]:border-[#1a72dd] data-[state=active]:bg-transparent"
              >
                <Building2 className="w-4 h-4" />
                <span className="hidden sm:inline">Location Details</span>
                <span className="sm:hidden">Location</span>
              </TabsTrigger>
              <TabsTrigger
                value="users"
                className="flex items-center gap-2 py-4 px-6 rounded-none border-b-2 border-transparent data-[state=active]:border-[#1a72dd] data-[state=active]:bg-transparent"
              >
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Users</span>
                <span className="sm:hidden">Users</span>
              </TabsTrigger>
              <TabsTrigger
                value="devices"
                className="flex items-center gap-2 py-4 px-6 rounded-none border-b-2 border-transparent data-[state=active]:border-[#1a72dd] data-[state=active]:bg-transparent"
              >
                <Monitor className="w-4 h-4" />
                <span className="hidden sm:inline">Devices</span>
                <span className="sm:hidden">Devices</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Tab Content */}
      <div className="flex-1">{children}</div>
    </div>
  )
}
