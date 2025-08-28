"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useProducts } from "@/hooks/use-products"
import { useToast } from "@/hooks/use-toast"
import { useCurrentUser } from "@/hooks/useCurrentUser"

export default function CreateProduct() {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useCurrentUser()
  const { createProduct } = useProducts()
  
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await createProduct.mutateAsync({
        productName: formData.name,
        description: formData.description,
        retailPrice: parseFloat(formData.price),
        cost: formData.cost ? parseFloat(formData.cost) : undefined,
        status: formData.status
      })

      toast({
        title: "Success",
        description: "Product created successfully",
      })
      
      router.push("/product-list")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to create product",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push("/product-list")
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Create New Product</h1>
            <p className="text-gray-600 dark:text-gray-300">Add a new product to your catalog</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleCancel} variant="outline">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="bg-[#1a72dd] hover:bg-[#1557b8]"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? "Creating..." : "Create Product"}
          </Button>
        </div>
      </div>

      {/* Create Form */}
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

        {/* Image Upload Placeholder */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle>Product Image</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
              <Plus className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-300 mb-2">Upload Product Image</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Image upload functionality will be added in a future update
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Created By</Label>
                <Input 
                  value={user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.email || "N/A"} 
                  disabled 
                  className="bg-gray-50 dark:bg-gray-700" 
                />
              </div>
              <div>
                <Label>User Role</Label>
                <Input 
                  value={user?.role || "N/A"} 
                  disabled 
                  className="bg-gray-50 dark:bg-gray-700" 
                />
              </div>
            </div>
            
            {user?.companyId && (
              <div>
                <Label>Company ID</Label>
                <Input 
                  value={user.companyId} 
                  disabled 
                  className="bg-gray-50 dark:bg-gray-700" 
                />
              </div>
            )}
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
