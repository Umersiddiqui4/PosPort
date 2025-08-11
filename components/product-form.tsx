"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useProducts } from "@/hooks/use-products"
import { useUserDataStore } from "@/lib/store"
import { useCatalogById } from "@/hooks/use-cataogById"
import type { Product } from "@/hooks/use-products"

interface ProductFormProps {
  product?: Product
  onSuccess?: () => void
  onCancel?: () => void
  selectedCategoryId?: string
}

export default function ProductForm({ product, onSuccess, onCancel, selectedCategoryId }: ProductFormProps) {
  const { createProduct, updateProduct } = useProducts()
  const user = useUserDataStore((state) => state.user)
  const params = useParams()
  
  // Get catalogId from URL params
  const catalogId = params?.userId as string
  
  // Fetch catalog data to get locationId
  const { data: catalogData, isLoading: catalogLoading } = useCatalogById(catalogId)
  
  // Debug logging
  console.log("ProductForm Debug:", {
    catalogId,
    catalogData,
    catalogLoading,
    userLocationId: user?.locationId,
    catalogLocationId: catalogData?.locationId,
    selectedCategoryId,
    urlParamsId: params?.Id
  })
  
  const [formData, setFormData] = useState({
    productName: product?.productName || "",
    description: product?.description || "",
    retailPrice: product?.price || 0,
    cost: 0, // API Product doesn't have cost field
    uom: "Piece", // API Product doesn't have uom field
    image: product?.image || "",
    status: product?.status || "active",
  })

  const isEditing = !!product

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Use selectedCategoryId prop instead of URL params
      const categoryId = selectedCategoryId || params?.Id as string
      
      console.log("ProductForm Debug - Creating product with categoryId:", categoryId)
      console.log("ProductForm Debug - selectedCategoryId prop:", selectedCategoryId)
      console.log("ProductForm Debug - URL params Id:", params?.Id)
      
      // Get locationId from catalog data instead of user
      const locationId = catalogData?.locationId || user?.locationId
      
      // Validate that we have required data
      if (!locationId) {
        console.error("No locationId available from catalog or user")
        throw new Error("Location information not available")
      }
      
      if (!categoryId) {
        console.error("No categoryId available")
        throw new Error("Category information not available")
      }
      
      // Prepare the data with required fields
      const productData = {
        ...formData,
        categoryId: categoryId,
        companyId: user?.companyId,
        locationId: locationId,
      }
      
      if (isEditing) {
        await updateProduct.mutateAsync({
          id: product.id,
          ...productData,
        })
      } else {
        await createProduct.mutateAsync(productData)
      }
      
      onSuccess?.()
    } catch (error) {
      console.error("Failed to save product:", error)
    }
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {catalogLoading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <p className="text-blue-800 text-sm">Loading catalog information...</p>
        </div>
      )}
      <div>
        <Label htmlFor="productName">Product Name *</Label>
        <Input
          id="productName"
          value={formData.productName}
          onChange={(e) => handleInputChange("productName", e.target.value)}
          placeholder="Enter product name"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          placeholder="Enter product description"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="retailPrice">Retail Price (PKR) *</Label>
          <Input
            id="retailPrice"
            type="number"
            value={formData.retailPrice}
            onChange={(e) => handleInputChange("retailPrice", Number(e.target.value))}
            placeholder="0"
            min="0"
            step="0.01"
            required
          />
        </div>

        <div>
          <Label htmlFor="cost">Cost (PKR)</Label>
          <Input
            id="cost"
            type="number"
            value={formData.cost}
            onChange={(e) => handleInputChange("cost", Number(e.target.value))}
            placeholder="0"
            min="0"
            step="0.01"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="uom">Unit of Measure</Label>
        <Select
          value={formData.uom}
          onValueChange={(value) => handleInputChange("uom", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select UOM" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Piece">Piece</SelectItem>
            <SelectItem value="Bottle">Bottle</SelectItem>
            <SelectItem value="Pack">Pack</SelectItem>
            <SelectItem value="Kg">Kilogram</SelectItem>
            <SelectItem value="Liter">Liter</SelectItem>
            <SelectItem value="Box">Box</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="image">Image URL</Label>
        <Input
          id="image"
          value={formData.image}
          onChange={(e) => handleInputChange("image", e.target.value)}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div>
        <Label htmlFor="status">Status</Label>
        <Select
          value={formData.status}
          onValueChange={(value) => handleInputChange("status", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2 pt-4">
        <Button
          type="submit"
          disabled={createProduct.isPending || updateProduct.isPending || catalogLoading}
          className="flex-1"
        >
          {createProduct.isPending || updateProduct.isPending ? "Saving..." : 
           catalogLoading ? "Loading catalog..." : 
           isEditing ? "Update Product" : "Create Product"}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
} 