"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, X } from "lucide-react"
import { useProducts } from "@/hooks/use-products"
import { useUserDataStore } from "@/lib/store"
import { useCatalogById } from "@/hooks/use-cataogById"
import { useLocations } from "@/hooks/useLocation"
import { CreateComboRequest } from "@/lib/Api/createCombo"
import { Combo } from "@/hooks/use-combos"
import { useComboOperations } from "@/hooks/use-combo-operations"
import ProductSelectionPopup from "./product-selection-popup"
import { useQuery } from "@tanstack/react-query"
import { getCompanies } from "@/lib/Api/getCompanies"

interface ComboFormProps {
  combo?: Combo
  onSuccess?: () => void
  onCancel?: () => void
}

export default function ComboForm({ combo, onSuccess, onCancel }: ComboFormProps) {
  const user = useUserDataStore((state) => state.user)
  const { products } = useProducts()
  const { createCombo, isCreating } = useComboOperations()
  const [isProductPopupOpen, setIsProductPopupOpen] = useState(false)
  
  // Fetch companies for POSPORT_ADMIN
  const shouldFetchCompanies = user?.role === "POSPORT_ADMIN"
  const { data: companiesData } = useQuery({
    queryKey: shouldFetchCompanies ? ["companies", "all-for-combo"] : ["company", user?.companyId],
    queryFn: async () => {
      if (shouldFetchCompanies) {
        return getCompanies("", 1, 100)
      }
      // Fallback for non-admin users
      return {
        data: user?.companyId ? [{ id: user.companyId, name: "My Company" }] : [],
        meta: {
          page: 1,
          take: 100,
          itemCount: user?.companyId ? 1 : 0,
          pageCount: 1,
          hasPreviousPage: false,
          hasNextPage: false,
        },
      }
    },
    enabled: !!user,
  })
  const companies = companiesData?.data || []
  
  // Get catalogId from URL params
  const catalogId = typeof window !== 'undefined' ? window.location.pathname.split('/')[2] : ''
  
  // Fetch catalog data to get locationId
  const { data: catalogData } = useCatalogById(catalogId)
  
  const [formData, setFormData] = useState<CreateComboRequest>({
    name: combo?.name || "New Combo",
    description: combo?.description || "",
    bundlePrice: combo?.bundlePrice || 0,
    shouldShowSeparatePrice: combo?.shouldShowSeparatePrice || false,
    status: combo?.status || "active",
    companyId: user?.companyId || "",
    locationId: catalogData?.locationId || user?.locationId || "",
    productIds: combo?.comboItems?.map(item => item.productId) || []
  })

  // Track product quantities separately
  const [productQuantities, setProductQuantities] = useState<Record<string, number>>({})

  const isEditing = !!combo

  // Fetch locations for dropdown - filter by selected company for POSPORT_ADMIN
  const { data: locationsData } = useLocations(1, 100, "", formData.companyId || undefined)
  const locations = locationsData?.items || []

  useEffect(() => {
    if (catalogData?.locationId) {
      setFormData(prev => ({
        ...prev,
        locationId: catalogData.locationId
      }))
    }
  }, [catalogData])

  // Update locations when company changes for POSPORT_ADMIN
  useEffect(() => {
    if (shouldFetchCompanies && formData.companyId) {
      // Reset location when company changes
      setFormData(prev => ({
        ...prev,
        locationId: ""
      }))
    }
  }, [formData.companyId, shouldFetchCompanies])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      console.log('Form data before validation:', formData)
      console.log('Product quantities:', productQuantities)
      
      // Validate required fields
      if (!formData.name.trim()) {
        throw new Error("Combo name is required")
      }
      if (!formData.bundlePrice || formData.bundlePrice <= 0) {
        throw new Error("Bundle price must be greater than 0")
      }
      
      // Ensure bundlePrice is a number
      const bundlePrice = Number(formData.bundlePrice)
      if (isNaN(bundlePrice)) {
        throw new Error("Bundle price must be a valid number")
      }
      if (formData.productIds.length === 0) {
        throw new Error("Please select at least one product")
      }
      
      // Validate product IDs
      console.log('Selected product IDs:', formData.productIds)
      for (const productId of formData.productIds) {
        if (!productId || typeof productId !== 'string') {
          throw new Error("Invalid product ID format")
        }
      }
      if (!formData.companyId) {
        throw new Error("Company ID is required")
      }
      
      // Additional validation for POSPORT_ADMIN
      if (shouldFetchCompanies && !formData.companyId) {
        throw new Error("Please select a company")
      }
      if (!formData.locationId) {
        throw new Error("Location ID is required")
      }
      
      // Log all required fields for debugging
      console.log('Validation passed - all required fields present:')
      console.log('- Name:', formData.name)
      console.log('- Bundle Price:', formData.bundlePrice)
      console.log('- Company ID:', formData.companyId)
      console.log('- User Role:', user?.role)
      console.log('- Should Fetch Companies:', shouldFetchCompanies)
      console.log('- Location ID:', formData.locationId)
      console.log('- Product IDs:', formData.productIds)

      // Create combo with product quantities
      const comboData = {
        ...formData,
        bundlePrice: Number(formData.bundlePrice), // Ensure it's a number
        productQuantities
      }
      console.log('Sending combo data:', comboData)
      await createCombo(comboData)
      
      onSuccess?.()
    } catch (error: any) {
      console.error("Failed to save combo:", error)
      console.error("Error details:", error?.response?.data)
      alert(error.message)
    }
  }

  const handleInputChange = (field: keyof CreateComboRequest, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleProductToggle = (productId: string) => {
    setFormData(prev => ({
      ...prev,
      productIds: prev.productIds.includes(productId)
        ? prev.productIds.filter(id => id !== productId)
        : [...prev.productIds, productId]
    }))
    
    // Initialize quantity to 1 when adding a product
    if (!formData.productIds.includes(productId)) {
      setProductQuantities(prev => ({
        ...prev,
        [productId]: 1
      }))
    } else {
      // Remove quantity when removing product
      setProductQuantities(prev => {
        const newQuantities = { ...prev }
        delete newQuantities[productId]
        return newQuantities
      })
    }
  }

  const handleQuantityChange = (productId: string, quantity: number) => {
    setProductQuantities(prev => ({
      ...prev,
      [productId]: quantity
    }))
  }

  const selectedProducts = products.filter(product => formData.productIds.includes(product.id))
  
  // Calculate total items including quantities
  const totalSelectedItems = formData.productIds.reduce((total, productId) => {
    return total + (productQuantities[productId] || 1)
  }, 0)

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="name">Combo Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          placeholder="Enter combo name"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          placeholder="Enter combo description"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="bundlePrice">Bundle Price (PKR) *</Label>
        <Input
          id="bundlePrice"
          type="number"
          value={formData.bundlePrice}
          onChange={(e) => handleInputChange("bundlePrice", Number(e.target.value))}
          placeholder="0"
          min="0"
          step="0.01"
          required
        />
      </div>

      {/* Company Selection - Only show for POSPORT_ADMIN */}
      {shouldFetchCompanies && (
        <div>
          <Label htmlFor="companyId">Company *</Label>
          <Select
            value={formData.companyId}
            onValueChange={(value) => handleInputChange("companyId", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a company" />
            </SelectTrigger>
            <SelectContent>
              {companies.map((company) => (
                <SelectItem key={company.id} value={company.id}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {formData.companyId && (
            <p className="text-xs text-green-600 mt-1">
              ✓ Company selected: {companies.find(c => c.id === formData.companyId)?.name}
            </p>
          )}
        </div>
      )}

      <div>
        <Label htmlFor="locationId">Location *</Label>
        <Select
          value={formData.locationId}
          onValueChange={(value) => handleInputChange("locationId", value)}
          disabled={shouldFetchCompanies && !formData.companyId}
        >
          <SelectTrigger>
            <SelectValue placeholder={shouldFetchCompanies && !formData.companyId ? "Select a company first" : "Select a location"} />
          </SelectTrigger>
          <SelectContent>
            {locations.length === 0 ? (
              <div className="px-2 py-1.5 text-sm text-gray-500">
                {shouldFetchCompanies && !formData.companyId ? "Select a company first" : "No locations available"}
              </div>
            ) : (
              locations.map((location) => (
                <SelectItem key={location.id} value={location.id}>
                  {location.locationName}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        {shouldFetchCompanies && formData.companyId && (
          <p className="text-xs text-gray-500 mt-1">
            Showing locations for selected company
          </p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="shouldShowSeparatePrice"
          checked={formData.shouldShowSeparatePrice}
          onCheckedChange={(checked) => handleInputChange("shouldShowSeparatePrice", checked)}
        />
        <Label htmlFor="shouldShowSeparatePrice">Show separate price</Label>
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

      <div>
        <Label>Select Products *</Label>
        <div className="mt-2 space-y-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsProductPopupOpen(true)}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Products
          </Button>
          
          {formData.productIds.length > 0 && (
            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-sm mb-3">Selected Products ({totalSelectedItems} items)</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedProducts.map((product) => (
                  <div key={product.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <img
                      src={product.attachments?.[0]?.url || "/placeholder.jpg"}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{product.name}</p>
                      <p className="text-xs text-gray-500">
                        {product.retailPrice.toFixed(2)} PKR × {productQuantities[product.id] || 1}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleProductToggle(product.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" className="flex-1" disabled={isCreating}>
          {isCreating ? "Creating..." : (isEditing ? "Update Combo" : "Create Combo")}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isCreating}>
            Cancel
          </Button>
        )}
      </div>
    </form>

    {/* Product Selection Popup */}
    <ProductSelectionPopup
      isOpen={isProductPopupOpen}
      onClose={() => setIsProductPopupOpen(false)}
      selectedProductIds={formData.productIds}
      onProductToggle={handleProductToggle}
      locationId={formData.locationId}
      selectedProductQuantities={productQuantities}
      onQuantityChange={handleQuantityChange}
    />
  </>
  )
}
