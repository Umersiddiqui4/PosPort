"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Edit, Trash2, Package, Calendar, TrendingUp, BarChart3, Clock, MapPin, Tag, DollarSign, AlertCircle, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { useProductById } from "@/hooks/use-product-by-id"
import { useProductLifetimeDetails } from "@/hooks/use-product-lifetime-details"
import { useProductTrackingDetails } from "@/hooks/use-product-tracking-details"
import { useProductInventory } from "@/hooks/use-product-inventory"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import LifetimeDetailsForm from "@/components/lifetime-details-form"
import TrackingDetailsForm from "@/components/tracking-details-form"
import InventoryForm from "@/components/inventory-form"
import BarcodeDisplay from "@/components/barcode-display"
import PrintBarcode from "@/components/print-barcode"

export default function ProductDetail() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useCurrentUser()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isLifetimeFormOpen, setIsLifetimeFormOpen] = useState(false)
  const [lifetimeFormMode, setLifetimeFormMode] = useState<"create" | "edit">("create")
  const [isTrackingFormOpen, setIsTrackingFormOpen] = useState(false)
  const [trackingFormMode, setTrackingFormMode] = useState<"create" | "edit">("create")
  const [isInventoryFormOpen, setIsInventoryFormOpen] = useState(false)
  const [inventoryFormMode, setInventoryFormMode] = useState<"create" | "edit">("create")
  
  const productId = params?.id as string
  
  // Fetch product details
  const { data: product, isLoading, error } = useProductById(productId)
  
  // Fetch lifetime details
  const { 
    lifetimeDetails, 
    isLoading: lifetimeLoading, 
    error: lifetimeError,
    createLifetimeDetails,
    updateLifetimeDetails,
    deleteLifetimeDetails
  } = useProductLifetimeDetails(productId)
  
  // Fetch tracking details
  const { 
    trackingDetails, 
    isLoading: trackingLoading, 
    error: trackingError,
    createTrackingDetails,
    updateTrackingDetails,
    deleteTrackingDetails
  } = useProductTrackingDetails(productId)
  
  // Fetch inventory details
  const { 
    inventory, 
    isLoading: inventoryLoading, 
    error: inventoryError,
    createInventory,
    updateInventory,
    updateStockQuantity,
    deleteInventory
  } = useProductInventory(productId)
  
  const canManageProducts = user?.role === "POSPORT_ADMIN" || user?.role === "COMPANY_OWNER"

  const handleEdit = () => {
    router.push(`/product-list/${productId}/edit`)
  }

  const handleDelete = async () => {
    // TODO: Implement delete functionality
    toast({
      title: "Product deleted",
      description: "Product has been deleted successfully.",
    })
    router.push("/product-list")
  }

  const handleBack = () => {
    router.push("/product-list")
  }

  const handleOpenLifetimeForm = (mode: "create" | "edit") => {
    setLifetimeFormMode(mode)
    setIsLifetimeFormOpen(true)
  }

  const handleCloseLifetimeForm = () => {
    setIsLifetimeFormOpen(false)
  }

  const handleOpenTrackingForm = (mode: "create" | "edit") => {
    setTrackingFormMode(mode)
    setIsTrackingFormOpen(true)
  }

  const handleCloseTrackingForm = () => {
    setIsTrackingFormOpen(false)
  }

  const handleOpenInventoryForm = (mode: "create" | "edit") => {
    setInventoryFormMode(mode)
    setIsInventoryFormOpen(true)
  }

  const handleCloseInventoryForm = () => {
    setIsInventoryFormOpen(false)
  }

  if (isLoading || lifetimeLoading || trackingLoading || inventoryLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1a72dd]"></div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-600">Error loading product details. Please try again.</div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6 h-full overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={handleBack} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{product.name}</h1>
            <p className="text-gray-600 dark:text-gray-300">Product Details</p>
          </div>
        </div>
        {canManageProducts && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <Button 
              onClick={handleEdit} 
              variant="outline"
              className="bg-white hover:bg-gray-50 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button 
              onClick={() => setIsDeleteDialogOpen(true)} 
              variant="destructive"
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        )}
      </div>

      {/* Product Overview Card */}
      <Card className="dark:bg-gray-800 dark:border-gray-700 mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Product Image */}
            <div className="lg:col-span-1">
              <div className="aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
                <img
                  src={product.attachments?.[0]?.url || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Product Info */}
            <div className="lg:col-span-2 space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {product.name}
                </h2>
                {product.description && (
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {product.description}
                  </p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-[#1a72dd]" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Price</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {product.retailPrice} PKR
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-purple-500" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Status</p>
                    <Badge 
                      variant={product.status === "active" ? "default" : "secondary"}
                      className={
                        product.status === "active" 
                          ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                      }
                    >
                      {product.status}
                    </Badge>
                  </div>
                </div>
              </div>
              
              {product.cost && (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-red-500" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Cost Price</p>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        {product.cost} PKR
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="lifetime" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 gap-1 p-1 mb-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <TabsTrigger 
            value="lifetime" 
            className="flex items-center justify-center gap-1 text-xs px-1 py-2"
          >
            <Clock className="w-3 h-3" />
            <span>Lifetime</span>
          </TabsTrigger>
          <TabsTrigger 
            value="tracking" 
            className="flex items-center justify-center gap-1 text-xs px-1 py-2"
          >
            <TrendingUp className="w-3 h-3" />
            <span>Tracking</span>
          </TabsTrigger>
          <TabsTrigger 
            value="inventory" 
            className="flex items-center gap-1 text-xs px-1 py-2"
          >
            <BarChart3 className="w-3 h-3" />
            <span>Stock</span>
          </TabsTrigger>
        </TabsList>

        {/* Lifetime Detail Tab */}
        <TabsContent value="lifetime" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#1a72dd]" />
                  Creation Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                  <span className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">Created Date:</span>
                  <span className="font-medium text-sm sm:text-base">
                    {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : "N/A"}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                  <span className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">Last Updated:</span>
                  <span className="font-medium text-sm sm:text-base">
                    {product.updatedAt ? new Date(product.updatedAt).toLocaleDateString() : "N/A"}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                  <span className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">Product ID:</span>
                  <span className="font-mono text-xs sm:text-sm break-all">{product.id}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-500" />
                  Location Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                  <span className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">Location ID:</span>
                  <span className="font-mono text-xs sm:text-sm break-all">{product.locationId || "N/A"}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                  <span className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">Company ID:</span>
                  <span className="font-mono text-xs sm:text-sm break-all">{product.companyId || "N/A"}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                  <span className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">Catalog ID:</span>
                  <span className="font-mono text-xs sm:text-sm break-all">{product.catalogId || "N/A"}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lifetime Details Section */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="pb-4">
              <div className="flex flex-col gap-3">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-500" />
                  <span className="text-base sm:text-lg">Product Lifetime Details</span>
                </CardTitle>
                {canManageProducts && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenLifetimeForm(lifetimeDetails ? "edit" : "create")}
                    className="w-full sm:w-auto sm:self-end bg-white hover:bg-gray-50 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    {lifetimeDetails ? "Edit" : "Add"}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {lifetimeError ? (
                <div className="text-center py-8 text-red-500">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Error loading lifetime details</p>
                  <p className="text-sm text-gray-500">Please try again later</p>
                </div>
              ) : lifetimeDetails ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                      <span className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">Expiry Date:</span>
                      <span className="font-medium text-sm sm:text-base">
                        {lifetimeDetails.expiry ? new Date(lifetimeDetails.expiry).toLocaleDateString() : "N/A"}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                      <span className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">Shelf Life:</span>
                      <span className="font-medium text-sm sm:text-base">{lifetimeDetails.shelfLife || "N/A"}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                      <span className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">Lifetime Details ID:</span>
                      <span className="font-mono text-xs sm:text-sm break-all">{lifetimeDetails.id}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                      <span className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">Created:</span>
                      <span className="font-medium text-sm sm:text-base">
                        {lifetimeDetails.createdAt ? new Date(lifetimeDetails.createdAt).toLocaleDateString() : "N/A"}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                      <span className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">Last Updated:</span>
                      <span className="font-medium text-sm sm:text-base">
                        {lifetimeDetails.updatedAt ? new Date(lifetimeDetails.updatedAt).toLocaleDateString() : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No lifetime details found</p>
                  <p className="text-sm">Lifetime details will appear here once added</p>
                  {canManageProducts && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenLifetimeForm("create")}
                      className="mt-4 w-full sm:w-auto bg-white hover:bg-gray-50 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Lifetime Details
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Attachments Section */}
          {product.attachments && product.attachments.length > 0 && (
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-purple-500" />
                  Product Attachments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.attachments.map((attachment, index) => (
                    <div key={attachment.id} className="space-y-2">
                      <div className="aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
                        <img
                          src={attachment.url}
                          alt={`${product.name} - ${attachment.filename}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-300">
                        <p className="font-medium truncate">{attachment.filename}</p>
                        <p>{(attachment.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Tracking Detail Tab */}
        <TabsContent value="tracking" className="space-y-4 mt-6">
          {/* Tracking Details Section */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="pb-4">
              <div className="flex flex-col gap-3">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-green-500" />
                  <span className="text-base sm:text-lg">Product Tracking Details</span>
                </CardTitle>
                {canManageProducts && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenTrackingForm(trackingDetails ? "edit" : "create")}
                    className="w-full sm:w-auto sm:self-end bg-white hover:bg-gray-50 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    {trackingDetails ? "Edit" : "Add"}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {trackingError ? (
                <div className="text-center py-8 text-red-500">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Error loading tracking details</p>
                  <p className="text-sm text-gray-500">Please try again later</p>
                </div>
              ) : trackingDetails ? (
                <div className="space-y-6">
                  {/* Barcode Display */}
                  <div className="flex flex-col items-center">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Product Barcode</h4>
                    <div className="w-full max-w-md">
                      <PrintBarcode 
                        value={trackingDetails.barCode}
                        productName={product.name}
                        sku={trackingDetails.sku}
                        className="bg-white p-2 sm:p-4 rounded-lg border w-full"
                      />
                    </div>
                  </div>
                  
                  {/* Details Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                        <span className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">Barcode:</span>
                        <span className="font-medium font-mono text-sm sm:text-base break-all">{trackingDetails.barCode}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                        <span className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">SKU:</span>
                        <span className="font-medium text-sm sm:text-base break-all">{trackingDetails.sku}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                        <span className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">Tracking Details ID:</span>
                        <span className="font-mono text-xs sm:text-sm break-all">{trackingDetails.id}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                        <span className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">Created:</span>
                        <span className="font-medium text-sm sm:text-base">
                          {trackingDetails.createdAt ? new Date(trackingDetails.createdAt).toLocaleDateString() : "N/A"}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                        <span className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">Last Updated:</span>
                        <span className="font-medium text-sm sm:text-base">
                          {trackingDetails.updatedAt ? new Date(trackingDetails.updatedAt).toLocaleDateString() : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No tracking details found</p>
                  <p className="text-sm">Tracking details will appear here once added</p>
                  {canManageProducts && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenTrackingForm("create")}
                      className="mt-4 w-full sm:w-auto bg-white hover:bg-gray-50 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Tracking Details
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sales Performance Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  Sales Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">0</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Total Sales</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">0</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Revenue</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Average Rating:</span>
                    <span className="font-medium">N/A</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Total Reviews:</span>
                    <span className="font-medium">0</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-orange-500" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Views Today:</span>
                    <span className="font-medium">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Views This Week:</span>
                    <span className="font-medium">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Views This Month:</span>
                    <span className="font-medium">0</span>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Conversion Rate:</span>
                    <span className="font-medium">0%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Popularity Score:</span>
                    <span className="font-medium">N/A</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No recent activity to display</p>
                <p className="text-sm">Activity tracking will appear here once the product is used</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Inventory Tab */}
        <TabsContent value="inventory" className="space-y-4 mt-6">
          {/* Inventory Details Section */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="pb-4">
              <div className="flex flex-col gap-3">
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-500" />
                  <span className="text-base sm:text-lg">Product Inventory</span>
                </CardTitle>
                {canManageProducts && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenInventoryForm(inventory ? "edit" : "create")}
                    className="w-full sm:w-auto sm:self-end bg-white hover:bg-gray-50 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    {inventory ? "Edit" : "Add"}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {inventoryError ? (
                <div className="text-center py-8 text-red-500">
                  <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Error loading inventory</p>
                  <p className="text-sm text-gray-500">Please try again later</p>
                </div>
              ) : inventory ? (
                <div className="space-y-6">
                  {/* Stock Overview */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{inventory.currentStock}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Current Stock</p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{inventory.reservedStock}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Reserved</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-3xl font-bold text-green-600 dark:text-green-400">{inventory.currentStock - inventory.reservedStock}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Available</p>
                    </div>
                  </div>
                  
                  {/* Inventory Details */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                        <span className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">Reorder Level:</span>
                        <span className="font-medium text-sm sm:text-base">{inventory.reorderLevel}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                        <span className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">Min Reorder Quantity:</span>
                        <span className="font-medium text-sm sm:text-base">{inventory.minimumReorderQuantity}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                        <span className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">Max Stock Capacity:</span>
                        <span className="font-medium text-sm sm:text-base">{inventory.maxStockCapacity}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                        <span className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">Cost Per Unit:</span>
                        <span className="font-medium text-sm sm:text-base">{inventory.costPerUnit} PKR</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                        <span className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">Inventory ID:</span>
                        <span className="font-mono text-xs sm:text-sm break-all">{inventory.id}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                        <span className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">Last Updated:</span>
                        <span className="font-medium text-sm sm:text-base">
                          {inventory.updatedAt ? new Date(inventory.updatedAt).toLocaleDateString() : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No inventory found</p>
                  <p className="text-sm">Inventory details will appear here once added</p>
                  {canManageProducts && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenInventoryForm("create")}
                      className="mt-4 w-full sm:w-auto bg-white hover:bg-gray-50 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Inventory
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product{" "}
              <span className="font-semibold">{product.name}</span> and all its associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Lifetime Details Form */}
      <LifetimeDetailsForm
        isOpen={isLifetimeFormOpen}
        onClose={handleCloseLifetimeForm}
        productId={productId}
        lifetimeDetails={lifetimeDetails}
        mode={lifetimeFormMode}
      />

      {/* Tracking Details Form */}
      <TrackingDetailsForm
        isOpen={isTrackingFormOpen}
        onClose={handleCloseTrackingForm}
        productId={productId}
        trackingDetails={trackingDetails}
        mode={trackingFormMode}
      />

      {/* Inventory Form */}
      <InventoryForm
        isOpen={isInventoryFormOpen}
        onClose={handleCloseInventoryForm}
        productId={productId}
        inventory={inventory}
        mode={inventoryFormMode}
      />
    </div>
  )
}
