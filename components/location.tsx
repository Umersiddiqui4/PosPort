/**
 * @fileoverview Locations Component
 * 
 * A comprehensive location management component that provides CRUD operations
 * for restaurant locations. This component handles location listing, creation,
 * editing, and deletion with proper error handling and user feedback.
 * 
 * @author Restaurant Management System
 * @version 1.0.0
 */

"use client"

import { useState, useEffect } from "react"
import PhoneInput from "react-phone-input-2"
import { useRouter, usePathname } from "next/navigation"
import { Plus, Search, Filter, MapPin, Edit, Trash2, Eye, Loader2 } from "lucide-react"
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
import { useLocations, useCreateLocation, useUpdateLocation, useDeleteLocation } from "@/hooks/useLocation"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import ErrorBoundary from "@/components/ErrorBoundary"

/**
 * Interface for location data structure
 */
interface Location {
  id: string
  locationName: string
  address: string
  city: string
  state: string
  country: string
  postalCode: string
  phone: string
  email: string
  qrCode: string
  companyId?: string
  createdAt: string
  updatedAt: string
}

/**
 * Interface for form data structure
 */
interface FormData {
  locationName: string
  address: string
  city: string
  state: string
  country: string
  postalCode: string
  phone: string
  email: string
  qrCode: string
}

/**
 * Props interface for the Locations component
 */
interface LocationsProps {
  /** The company ID to filter locations by */
  companyId?: string
}

/**
 * Locations Component
 * 
 * A comprehensive location management component that provides:
 * - Location listing with search and filtering
 * - Location creation with form validation
 * - Location editing with pre-populated forms
 * - Location deletion with confirmation dialogs
 * - Role-based access control
 * - Error handling and loading states
 * 
 * @param props - Component props containing companyId
 * @returns JSX.Element - The rendered locations management interface
 * 
 * @example
 * ```tsx
 * <Locations companyId="company-123" />
 * ```
 */
export default function Locations({ companyId }: LocationsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user } = useCurrentUser()
  
  // State management for UI interactions
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [formData, setFormData] = useState<FormData>({
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

  // API hooks for data operations
  const { data: locationsData, isLoading, error } = useLocations(1, 100, debouncedSearchTerm, companyId || "", "")
  const locationItems = (locationsData as any)?.items || []
  const createLocationMutation = useCreateLocation()
  const updateLocationMutation = useUpdateLocation()
  const deleteLocationMutation = useDeleteLocation()

  // Debounce search to call API, not filter client-side
  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearchTerm(searchTerm), 300)
    return () => clearTimeout(id)
  }, [searchTerm])

  const serverLocations = locationItems

  /**
   * Determines brand information based on location name
   * @param name - The location name to analyze
   * @returns Object containing brand name and color classes
   */
  const getBrandFromName = (name: string) => {
    if (name.includes("Pizza Palace")) return { name: "Pizza Palace", color: "bg-red-100 text-red-800" }
    if (name.includes("Burger Bistro")) return { name: "Burger Bistro", color: "bg-orange-100 text-orange-800" }
    if (name.includes("Sushi Central")) return { name: "Sushi Central", color: "bg-green-100 text-green-800" }
    return { name: "Other", color: "bg-gray-100 text-gray-800" }
  }

  /**
   * Opens the edit modal and populates form with location data
   * @param location - The location to edit
   */
  const openEditModal = (location: Location) => {
    setSelectedLocation(location)
    setFormData({
      locationName: location.locationName,
      address: location.address,
      city: location.city,
      state: location.state,
      country: location.country,
      postalCode: location.postalCode,
      phone: location.phone || "",
      email: location.email,
      qrCode: location.qrCode,
    })
    setIsEditModalOpen(true)
  }

  /**
   * Handles location creation
   */
  const handleCreateLocation = async () => {
    if (formData.locationName && formData.address && formData.email) {
      try {
        await createLocationMutation.mutateAsync({
          ...formData,
          phone: formData.phone?.startsWith("+") ? formData.phone : `+${(formData.phone || "").replace(/^0+/, "")}`,
          companyId: companyId || "",
        })
        setIsCreateModalOpen(false)
        resetForm()
      } catch (error) {
        console.error("Failed to create location:", error)
      }
    }
  }

  /**
   * Handles location editing
   */
  const handleEditLocation = async () => {
    if (selectedLocation && formData.locationName && formData.address && formData.email) {
      try {
        await updateLocationMutation.mutateAsync({
          id: selectedLocation.id,
          ...formData,
          phone: formData.phone?.startsWith("+") ? formData.phone : `+${(formData.phone || "").replace(/^0+/, "")}`,
        })
        setIsEditModalOpen(false)
        setSelectedLocation(null)
      } catch (error) {
        console.error("Failed to update location:", error)
      }
    }
  }

  /**
   * Handles location deletion
   */
  const handleDeleteLocation = async () => {
    if (selectedLocation) {
      try {
        await deleteLocationMutation.mutateAsync(selectedLocation.id)
        setIsDeleteDialogOpen(false)
        setSelectedLocation(null)
      } catch (error) {
        console.error("Failed to delete location:", error)
      }
    }
  }

  /**
   * Resets the form data to initial state
   */
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

  /**
   * Navigates to location detail page
   * @param locationId - The ID of the location to view
   */
  const handleViewLocation = (locationId: string) => {
    // Check if we're in a company context
    const isCompanyContext = pathname?.includes('/companies/') && companyId
    if (isCompanyContext) {
      // Navigate to company-specific location detail page
      router.push(`/companies/${companyId}/locations/${locationId}/locationDetail`)
    } else {
      // Navigate to generic location detail page
      router.push(`/locations/${locationId}`)
    }
  }

  // Loading state (only initial)
  if (isLoading && locationItems.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#1a72dd]" />
        <span className="ml-2 text-gray-600">Loading locations...</span>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-600 mb-4">Error loading locations</div>
          <Button onClick={() => window.location.reload()} variant="outline">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  // Check user permissions
  const canManageLocations = user?.role === "POSPORT_ADMIN" || user?.role === "COMPANY_OWNER"

  return (
    <ErrorBoundary>
      <div className="bg-background transition-colors duration-300 p-4 sm:p-6 overflow-auto h-screen">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Locations
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage your restaurant locations
            </p>
          </div>
          
          {canManageLocations && (
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="w-full sm:w-auto bg-[#1a72dd] text-white hover:bg-[#1557b8] dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Location
            </Button>
          )}
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
         
        </div>

        {/* Locations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {serverLocations.map((location: Location) => (
            <Card key={location.id} className="hover:shadow-lg overflow-hidden transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                      {location.locationName}
                    </CardTitle>
                    <div className="flex items-center mt-2">
                      <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {location.city}, {location.state}
                      </span>
                    </div>
                  </div>
                  {(() => {
                    const brand = getBrandFromName(location.locationName)
                    return <Badge className={brand.color}>{brand.name}</Badge>
                  })()}
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <p>{location.address}</p>
                  <p>{location.phone}</p>
                  <p>{location.email}</p>
                </div>
                
                <div className="flex justify-between items-center mt-4 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewLocation(location.id)}
                  >
                    <Eye className="h-4 w-4 " />
                  
                  </Button>
                  
                  {canManageLocations && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditModal(location)}
                      >
                        <Edit className="h-4 w-4 " />
                        
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedLocation(location)
                          setIsDeleteDialogOpen(true)
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4 " />
                      
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {serverLocations.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No locations found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchTerm ? "Try adjusting your search terms." : "Get started by adding your first location."}
            </p>
            {canManageLocations && !searchTerm && (
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-[#1a72dd] text-white hover:bg-[#1557b8] dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Location
              </Button>
            )}
          </div>
        )}

        {/* Create Location Modal */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Location</DialogTitle>
              <DialogDescription>
                Enter the details for your new restaurant location.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Location Name</label>
                <Input
                  value={formData.locationName}
                  onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
                  placeholder="Enter location name"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Address</label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Enter address"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">City</label>
                  <Input
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Enter city"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">State</label>
                  <Input
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="Enter state"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Country</label>
                  <Input
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="Enter country"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Postal Code</label>
                  <Input
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    placeholder="Enter postal code"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Phone</label>
                <div className="w-full h-fit">
                  <PhoneInput
                    country={'pk'}
                    value={formData.phone}
                    onChange={(value: string) => {
                      let formatted = value
                      if (formatted && !formatted.startsWith('+')) {
                        formatted = `+${formatted.replace(/^0+/, '')}`
                      }
                      setFormData({ ...formData, phone: formatted })
                    }}
                    inputProps={{ name: 'phone', required: true, id: 'location-phone' }}
                    inputClass="!w-full !h-10 !text-base !border !border-gray-300 dark:!border-gray-600 rounded-md p-2 dark:!bg-gray-700 dark:!text-gray-200"
                    buttonClass="!h-3"
                    containerClass="!w-full"
                    placeholder="Enter phone number"
                    enableSearch
                  />
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreateLocation}
                disabled={createLocationMutation.isPending}
              >
                {createLocationMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Location"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Location Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Location</DialogTitle>
              <DialogDescription>
                Update the details for this location.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Location Name</label>
                <Input
                  value={formData.locationName}
                  onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
                  placeholder="Enter location name"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Address</label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Enter address"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">City</label>
                  <Input
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Enter city"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">State</label>
                  <Input
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="Enter state"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Country</label>
                  <Input
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="Enter country"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Postal Code</label>
                  <Input
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    placeholder="Enter postal code"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Phone</label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter phone number"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleEditLocation}
                disabled={updateLocationMutation.isPending}
              >
                {updateLocationMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
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
                This action cannot be undone. This will permanently delete the location
                "{selectedLocation?.locationName}" and remove all associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteLocation}
                className="bg-red-600 hover:bg-red-700"
                disabled={deleteLocationMutation.isPending}
              >
                {deleteLocationMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
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
    </ErrorBoundary>
  )
}
