"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useProductById } from "@/hooks/use-product-by-id"
import { useProducts } from "@/hooks/use-products"
import { useToast } from "@/hooks/use-toast"
import { useCurrentUser } from "@/hooks/useCurrentUser"

export default function EditProduct() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useCurrentUser()
  const productId = params?.id as string
  
  // Fetch product details
  const { data: product, isLoading, error } = useProductById(productId)
  const { updateProduct } = useProducts()
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    cost: "",
    stock: "",
    category: "",
    status: "active" as "active" | "inactive" | "draft"
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Populate form when product data is loaded
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price?.toString() || "",
        cost: product.cost?.toString() || "",
        stock: product.stock?.toString() || "",
        category: product.category || "",
        status: product.status || "active"
      })
    }
  }, [product])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await updateProduct.mutateAsync({
        id: productId,
        productName: formData.name,
        description: formData.description,
        retailPrice: parseFloat(formData.price),
        cost: formData.cost ? parseFloat(formData.cost) : undefined,
        status: formData.status
      })

      toast({
        title: "Success",
        description: "Product updated successfully",
      })
      
      router.push(`/product-list/${productId}`)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to update product",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push(`/product-list/${productId}`)
  }

  if (isLoading) {
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
          <Button variant="ghost" onClick={handleCancel} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Edit Product</h1>
            <p className="text-gray-600 dark:text-gray-300">Update product information</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleCancel} variant="outline">
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="bg-[#1a72dd] hover:bg-[#1557b8]"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Product Image Preview */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle>Product Image</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-square w-48 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
            <img
              src={product.attachments?.[0]?.url || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
            Image upload functionality will be added in a future update
          </p>
        </CardContent>
      </Card>

      {/* Edit Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter product description"
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Enter product category"
                />
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => setFormData({ ...formData, status: value as "active" | "inactive" | "draft" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Inventory */}
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle>Pricing & Inventory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="price">Retail Price (PKR) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <Label htmlFor="cost">Cost Price (PKR)</Label>
                <Input
                  id="cost"
                  type="number"
                  step="0.01"
                  value={formData.cost}
                  onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                  placeholder="0.00"
                />
              </div>

              <div>
                <Label htmlFor="stock">Stock Quantity *</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  placeholder="0"
                  required
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Information */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Product ID</Label>
                <Input value={product.id} disabled className="bg-gray-50 dark:bg-gray-700" />
              </div>
              <div>
                <Label>Location ID</Label>
                <Input value={product.locationId || "N/A"} disabled className="bg-gray-50 dark:bg-gray-700" />
              </div>
              <div>
                <Label>Company ID</Label>
                <Input value={product.companyId || "N/A"} disabled className="bg-gray-50 dark:bg-gray-700" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Created Date</Label>
                <Input 
                  value={product.createdAt ? new Date(product.createdAt).toLocaleDateString() : "N/A"} 
                  disabled 
                  className="bg-gray-50 dark:bg-gray-700" 
                />
              </div>
              <div>
                <Label>Last Updated</Label>
                <Input 
                  value={product.updatedAt ? new Date(product.updatedAt).toLocaleDateString() : "N/A"} 
                  disabled 
                  className="bg-gray-50 dark:bg-gray-700" 
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
