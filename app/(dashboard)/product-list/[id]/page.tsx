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
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import LifetimeDetailsForm from "@/components/lifetime-details-form"

export default function ProductDetail() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useCurrentUser()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isLifetimeFormOpen, setIsLifetimeFormOpen] = useState(false)
  const [lifetimeFormMode, setLifetimeFormMode] = useState<"create" | "edit">("create")
  
  const productId = params.id as string
  
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

  if (isLoading || lifetimeLoading) {
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={handleBack} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{product.name}</h1>
            <p className="text-gray-600 dark:text-gray-300">Product Details</p>
          </div>
        </div>
        {canManageProducts && (
          <div className="flex items-center gap-2">
            <Button onClick={handleEdit} variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button 
              onClick={() => setIsDeleteDialogOpen(true)} 
              variant="destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        )}
      </div>

      {/* Product Overview Card */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
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
      <Tabs defaultValue="lifetime" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="lifetime" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Lifetime Detail
          </TabsTrigger>
          <TabsTrigger value="tracking" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Tracking Detail
          </TabsTrigger>
          <TabsTrigger value="inventory" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Inventory
          </TabsTrigger>
        </TabsList>

        {/* Lifetime Detail Tab */}
        <TabsContent value="lifetime" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#1a72dd]" />
                  Creation Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Created Date:</span>
                  <span className="font-medium">
                    {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Last Updated:</span>
                  <span className="font-medium">
                    {product.updatedAt ? new Date(product.updatedAt).toLocaleDateString() : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Product ID:</span>
                  <span className="font-mono text-sm">{product.id}</span>
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
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Location ID:</span>
                  <span className="font-mono text-sm">{product.locationId || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Company ID:</span>
                  <span className="font-mono text-sm">{product.companyId || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Catalog ID:</span>
                  <span className="font-mono text-sm">{product.catalogId || "N/A"}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lifetime Details Section */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-500" />
                Product Lifetime Details
                {canManageProducts && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenLifetimeForm(lifetimeDetails ? "edit" : "create")}
                    className="ml-auto"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    {lifetimeDetails ? "Edit" : "Add"}
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {lifetimeError ? (
                <div className="text-center py-8 text-red-500">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Error loading lifetime details</p>
                  <p className="text-sm text-gray-500">Please try again later</p>
                </div>
              ) : lifetimeDetails ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Expiry Date:</span>
                      <span className="font-medium">
                        {lifetimeDetails.expiry ? new Date(lifetimeDetails.expiry).toLocaleDateString() : "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Shelf Life:</span>
                      <span className="font-medium">{lifetimeDetails.shelfLife || "N/A"}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Lifetime Details ID:</span>
                      <span className="font-mono text-sm">{lifetimeDetails.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Created:</span>
                      <span className="font-medium">
                        {lifetimeDetails.createdAt ? new Date(lifetimeDetails.createdAt).toLocaleDateString() : "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Last Updated:</span>
                      <span className="font-medium">
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
                      className="mt-4"
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
        <TabsContent value="tracking" className="space-y-4">
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
        <TabsContent value="inventory" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-500" />
                  Current Inventory
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                                 <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                   <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">0</p>
                   <p className="text-sm text-gray-600 dark:text-gray-300">Reserved</p>
                 </div>
                
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  Inventory History
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Last Restocked:</span>
                    <span className="font-medium">N/A</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Restock Quantity:</span>
                    <span className="font-medium">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Days Since Restock:</span>
                    <span className="font-medium">N/A</span>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Average Daily Usage:</span>
                    <span className="font-medium">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Estimated Days Left:</span>
                    <span className="font-medium">N/A</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stock Alerts */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                Stock Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No stock alerts at this time</p>
                <p className="text-sm">Alerts will appear here when stock levels are low</p>
              </div>
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
    </div>
  )
}
