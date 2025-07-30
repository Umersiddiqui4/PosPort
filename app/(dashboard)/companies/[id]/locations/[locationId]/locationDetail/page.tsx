"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { MapPin, Phone, Mail, QrCode, Edit, Trash2, Calendar, Clock, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { useLocationById, useUpdateLocation, useDeleteLocation } from "@/hooks/useLocation"
import { useQueryClient } from "@tanstack/react-query"

export default function LocationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const queryClient = useQueryClient()

  const companyId = params?.id as string
  const locationId = params?.locationId as string

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

  // Fetch the specific location by ID
  const { data: locationData, isLoading, error } = useLocationById(locationId)
  const local: any = locationData
  const location: any = local?.data

  const updateLocationMutation = useUpdateLocation()
  const deleteLocationMutation = useDeleteLocation()

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
      queryClient.invalidateQueries({ queryKey: ["location", locationId] })
    }
  }

  const handleDeleteLocation = async () => {
    if (location) {
      await deleteLocationMutation.mutateAsync(location.id)
      setIsDeleteDialogOpen(false)
      router.push(`/companies/${companyId}/locations`)
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

  if (error || !location) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-600 mb-4">Error loading location details</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={openEditModal}
          className="text-[#1a72dd] border-[#1a72dd] hover:bg-[#1a72dd] hover:text-white bg-transparent"
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit Location
        </Button>
        <Button
          variant="outline"
          onClick={() => setIsDeleteDialogOpen(true)}
          className="text-red-600 border-red-200 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Location
        </Button>
      </div>

      {/* Location Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-600">Email</div>
                <div className="font-medium text-gray-900">{location.email}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Phone className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-600">Phone</div>
                <div className="font-medium text-gray-900">{location.phone || "Not provided"}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Address</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <div className="font-medium text-gray-900 mb-1">{location.address}</div>
                <div className="text-gray-600">
                  {location.city && location.state && location.postalCode ? (
                    <span>
                      {location.city}, {location.state} {location.postalCode}
                    </span>
                  ) : (
                    <span>
                      {location.city || ""} {location.state || ""} {location.postalCode || ""}
                    </span>
                  )}
                </div>
                {location.country && <div className="text-gray-600">{location.country}</div>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* QR Code Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">QR Code</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <QrCode className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-600">QR Code ID</div>
                <div className="font-mono text-gray-900">{location.qrCode}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Timeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-600">Created</div>
                <div className="font-medium text-gray-900">
                  {new Date(location.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(location.createdAt).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Clock className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-600">Last Updated</div>
                <div className="font-medium text-gray-900">
                  {new Date(location.updatedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(location.updatedAt).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Location ID */}
      <Card>
        <CardContent className="p-4">
          <div className="text-xs text-gray-500">
            <span className="font-medium">Location ID:</span> {location.id}
          </div>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Location</DialogTitle>
            <DialogDescription>Update the location details below.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-locationName">Location Name *</Label>
                <Input
                  id="edit-locationName"
                  value={formData.locationName}
                  onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
                  placeholder="e.g., Pizza Palace - Downtown"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-qrCode">QR Code</Label>
                <Input
                  id="edit-qrCode"
                  value={formData.qrCode}
                  onChange={(e) => setFormData({ ...formData, qrCode: e.target.value })}
                  placeholder="QR Code"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-address">Address *</Label>
              <Input
                id="edit-address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Street address"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-city">City</Label>
                <Input
                  id="edit-city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="City"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-state">State</Label>
                <Input
                  id="edit-state"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="State"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-postalCode">Postal Code</Label>
                <Input
                  id="edit-postalCode"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  placeholder="ZIP/Postal"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-country">Country</Label>
                <Input
                  id="edit-country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  placeholder="Country"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1234567890"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email *</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="location@restaurant.com"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditModalOpen(false)
                resetForm()
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleEditLocation} className="bg-[#1a72dd] hover:bg-[#1557b8]" disabled={isSubmitting}>
              {updateLocationMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Location"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the location "{location.locationName}" and all
              associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteLocation}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={isSubmitting}
            >
              {deleteLocationMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Location"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
