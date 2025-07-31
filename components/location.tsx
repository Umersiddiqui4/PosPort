"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MapPin, Plus, Search, MoreVertical, Edit, Trash2, Phone, Mail, QrCode, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Menu } from "lucide-react"
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
import { useLocations, useCreateLocation, useUpdateLocation, useDeleteLocation, useLocationById }  from "@/hooks/useLocation"
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams } from "next/navigation";
import { useUserDataStore } from "@/lib/store";

interface Location {
  id: string
  createdAt: string
  updatedAt: string
  qrCode: string
  locationName: string
  address: string
  city: string
  state: string
  country: string
  postalCode: string
  phone: string
  email: string
  companyId?: string;
  userId?: string;
}

interface LocationsProps {
  companyId?: string;
}

export default function Locations({ companyId }: LocationsProps) {
  const router = useRouter();
  const user = useUserDataStore((state) => state.user);
  const searchParams = useSearchParams();
  const companyIdFromQuery = searchParams!.get("companyId");
  let effectiveCompanyId = companyId || companyIdFromQuery || undefined;
  let userId: string | undefined = undefined;
  // If not admin and no companyId is provided, restrict by user/company
  if (!effectiveCompanyId && user) {
    if (user.role === "COMPANY_OWNER" && user.companyId) {
      effectiveCompanyId = user.companyId;
    } else if (user.role === "STORE_KEEPER" && user.id) {
      userId = user.id;
    }
  }
  
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingLocation, setEditingLocation] = useState<Location | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [locationToDelete, setLocationToDelete] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
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

  console.log(effectiveCompanyId ,"effectiveCompanyId");
  
  // Check for locationId in query string for COMPANY_OWNER
  const locationIdFromQuery = searchParams!.get("locationId");
  const shouldShowSingleLocation = user?.role === "COMPANY_OWNER" && !!locationIdFromQuery;

  // Always call the hook, but only use the data when needed
  const { data: singleLocationData } = useLocationById(locationIdFromQuery || "");
  const singleLocation = shouldShowSingleLocation ? singleLocationData : null;

  // React Query hooks
  const { data: locationsData, isLoading, error } = useLocations(currentPage, 10, searchTerm, effectiveCompanyId, userId)
  const createLocationMutation = useCreateLocation()
  const updateLocationMutation = useUpdateLocation()
  const deleteLocationMutation = useDeleteLocation()

  console.log(locationsData, "locationsData");
  

  const locations = locationsData?.items || []

  // Frontend filter if backend doesn't filter
  let filteredLocations = locations;
  if (effectiveCompanyId) {
    filteredLocations = filteredLocations.filter(loc => (loc as Location).companyId === effectiveCompanyId);
  } else if (userId) {
    filteredLocations = filteredLocations.filter(loc => (loc as Location).userId === userId);
  }
  
  console.log(filteredLocations ,"filteredLocations");
  
  const pagination = locationsData?.meta || {
    page: 1,
    take: user?.role === "POSPORT_ADMIN" ? 10 : locations.length,
    itemCount: 0,
    pageCount: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  }

  const handleAddLocation = async () => {
    if (formData.locationName && formData.address && formData.email) {
      const dataToSend = { ...formData };
      console.log(dataToSend, "dataToSend");
      
      if (effectiveCompanyId) {
        (dataToSend as Location).companyId = effectiveCompanyId;
      }
      await createLocationMutation.mutateAsync(dataToSend);
      setIsAddModalOpen(false);
      resetForm();
    }
  }

  const handleEditLocation = async () => {
    if (editingLocation && formData.locationName && formData.address && formData.email) {
      await updateLocationMutation.mutateAsync({
        id: editingLocation.id,
        ...formData,
      })
      setIsEditModalOpen(false)
      setEditingLocation(null)
      resetForm()
    }
  }

  const confirmDeleteLocation = (id: string) => {
    setLocationToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteLocation = async () => {
    if (locationToDelete) {
      await deleteLocationMutation.mutateAsync(locationToDelete)
      setIsDeleteDialogOpen(false)
      setLocationToDelete(null)
    }
  }

  const openEditModal = (location: Location) => {
    setEditingLocation(location)
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

  const handlePreviousPage = () => {
    if (pagination.hasPreviousPage) {
      setCurrentPage((prev) => prev - 1)
    }
  }

  const handleNextPage = () => {
    if (pagination.hasNextPage) {
      setCurrentPage((prev) => prev + 1)
    }
  }

  const getBrandFromName = (name: string) => {
    if (name.includes("Pizza Palace")) return { name: "Pizza Palace", color: "bg-red-100 text-red-800" }
    if (name.includes("Burger Bistro")) return { name: "Burger Bistro", color: "bg-orange-100 text-orange-800" }
    if (name.includes("Sushi Central")) return { name: "Sushi Central", color: "bg-green-100 text-green-800" }
    return { name: "Other", color: "bg-gray-100 text-gray-800" }
  }

  const handleLocationClick = (locationId: string) => {
    if (effectiveCompanyId) {
      router.push(`/companies/${effectiveCompanyId}/locations/${locationId}/locationDetail`);
    }
  }

  const isSubmitting =
    createLocationMutation.isPending || updateLocationMutation.isPending || deleteLocationMutation.isPending

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading locations</h3>
          <p className="text-gray-600">Please try refreshing the page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background transition-colors duration-300 p-4 sm:p-6 overflow-auto h-screen">
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 hidden md:block">Location Management</h1>
            <p className="text-gray-600 hidden md:block">Manage all your restaurant locations</p>
          </div>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#1a72dd] hover:bg-[#1557b8] text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Location
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Location</DialogTitle>
                <DialogDescription>Create a new restaurant location with all the necessary details.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="locationName">Location Name *</Label>
                    <Input
                      id="locationName"
                      value={formData.locationName}
                      onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
                      placeholder="e.g., Pizza Palace - Downtown"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="qrCode">QR Code</Label>
                    <Input
                      id="qrCode"
                      value={formData.qrCode}
                      onChange={(e) => setFormData({ ...formData, qrCode: e.target.value })}
                      placeholder="Auto-generated if empty"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Street address"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="City"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      placeholder="State"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      placeholder="ZIP/Postal"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      placeholder="Country"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1234567890"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="location@restaurant.com"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddModalOpen(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button onClick={handleAddLocation} className="bg-[#1a72dd] hover:bg-[#1557b8]" disabled={isSubmitting}>
                  {createLocationMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    "Add Location"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Stats */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 flex  items-center">
            <Search className="absolute left-2 transform-translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-4">
            <Card className="px-4 py-2">
              <div className="text-sm text-gray-600">Total Locations</div>
              <div className="text-2xl font-bold text-[#1a72dd]">{pagination.itemCount}</div>
            </Card>
            <Card className="px-4 py-2">
              <div className="text-sm text-gray-600">Current Page</div>
              <div className="text-2xl font-bold text-green-600">
                {pagination.page} of {pagination.pageCount}
              </div>
            </Card>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-56 w-full rounded-2xl" />
            ))}
          </div>
        )}

        {/* Locations Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLocations.map((location: any) => {
              const brand = getBrandFromName(location.locationName)
              return (
                <Card 
                  key={location.id} 
                  className="hover:shadow-lg overflow-hidden transition-shadow cursor-pointer"
                  onClick={() => handleLocationClick(location.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
                          {location.locationName}
                        </CardTitle>
                        <Badge className={brand.color}>{brand.name}</Badge>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(location);
                          }}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            confirmDeleteLocation(location.id);
                          }} className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-gray-600">
                        <div>{location.address}</div>
                        <div>
                          {location.city}, {location.state} {location.postalCode}
                        </div>
                        <div>{location.country}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{location.phone}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{location.email}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <QrCode className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600 font-mono">{location.qrCode}</span>
                    </div>

                    <div className="pt-2 border-t">
                      <div className="text-xs text-gray-400">
                        Created: {new Date(location.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredLocations.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No locations found</h3>
            <p className="text-gray-600">Try adjusting your search or add a new location.</p>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && filteredLocations.length > 0 && (
          <div className="flex items-center justify-between pt-4">
            <div className="text-sm text-gray-600">
              Showing {filteredLocations.length} of {pagination.itemCount} locations
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handlePreviousPage} disabled={!pagination.hasPreviousPage}>
                Previous
              </Button>
              <Button variant="outline" onClick={handleNextPage} disabled={!pagination.hasNextPage}>
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

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
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)} disabled={isSubmitting}>
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
              This action cannot be undone. This will permanently delete the location and all associated data.
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
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
