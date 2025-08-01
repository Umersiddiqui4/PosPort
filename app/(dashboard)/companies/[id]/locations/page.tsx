

"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, MapPin, Phone, Mail, QrCode, Edit, Trash2, Building2, Calendar, Clock, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useLocations, useUpdateLocation, useDeleteLocation } from "@/hooks/useLocation"
import Locations from "@/components/location"

export default function CompanyLocationsPage() {
  const params = useParams() || {}
  const locationId = (params && (params as any).id) ? (params as any).id as string : ""

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    locationName: "",
    address: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    phone: "",
    email: "",
    qrCode: "",
  })

  const router = useRouter()

  // Fetch locations to find the specific one
  const { data: locationsData, isLoading, error } = useLocations(1, 100, "", locationId, "") // Get more items to find the location
  console.log(locationsData, "locationsData");
  
  const updateLocationMutation 
= useUpdateLocation()
  const deleteLocationMutation = useDeleteLocation()

  // FIX: Use 'id' instead of 'companyId' to find the location
  const location = locationsData?.items.find((loc: any) => loc.companyId === locationId)

  const getBrandFromName = (name: string) => {
    if (name.includes("Pizza Palace")) return { name: "Pizza Palace", color: "bg-red-100 text-red-800" }
    if (name.includes("Burger Bistro")) return { name: "Burger Bistro", color: "bg-orange-100 text-orange-800" }
    if (name.includes("Sushi Central")) return { name: "Sushi Central", color: "bg-green-100 text-green-800" }
    return { name: "Other", color: "bg-gray-100 text-gray-800" }
  }

  const openEditModal = () => {
    if (location) {
      setFormData({
        locationName: location.locationName,
        address: location.address,
        city: location.city,
        state: location.state,
        country: location.country,
        postalCode: location.postalCode,
        phone: location.phone,
        email: location.email,
        qrCode: location.qrCode,
      })
      setIsEditModalOpen(true)
    }
  }

  const handleEditLocation = async () => {
    if (location && formData.locationName && formData.address && formData.email) {
      await updateLocationMutation.mutateAsync({
        id: location.id,
        ...formData,
      })
      setIsEditModalOpen(false)
    }
  }

  const handleDeleteLocation = async () => {
    if (location) {
      await deleteLocationMutation.mutateAsync(location.id)
      setIsDeleteDialogOpen(false)
      router.push(`/companies`)
    }
  }

  const resetForm = () => {
    setFormData({
      locationName: "",
      address: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
      phone: "",
      email: "",
      qrCode: "",
    })
  }

  const isSubmitting = updateLocationMutation.isPending || deleteLocationMutation.isPending

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
          <Button onClick={() => router.push(`/companies`)} variant="outline">
            Back to Locations
          </Button>
        </div>
      </div>
    )
  }

 

  return (<Locations companyId={locationId} />
   
  )
}
