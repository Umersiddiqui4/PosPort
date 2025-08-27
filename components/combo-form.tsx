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
import { useCatalogContext } from "@/lib/contexts/CatalogContext"
import { useLocations } from "@/hooks/useLocation"
import { CreateComboRequest } from "@/lib/Api/createCombo"
import { Combo } from "@/hooks/use-combos"
import { useComboOperations } from "@/hooks/use-combo-operations"
import ProductSelectionPopup from "./product-selection-popup"
import { useQuery } from "@tanstack/react-query"
import { getCompanies } from "@/lib/Api/getCompanies"
import { useToast } from "@/hooks/use-toast"

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
  const { toast } = useToast()
  
  // Fetch companies for POSPORT_ADMIN only (skip for COMPANY_OWNER)
  const shouldFetchCompanies = user?.role === "POSPORT_ADMIN"
  const { data: companiesData } = useQuery({
    queryKey: shouldFetchCompanies ? ["companies", "all-for-combo"] : ["company", user?.companyId],
    queryFn: async () => {
      if (shouldFetchCompanies) {
        return getCompanies("", 1, 100)
      }
      // Fallback for non-admin users (including COMPANY_OWNER)
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
  
  // Use catalog context for current catalog and location data
  const { selectedCatalog, catalogData, locationId } = useCatalogContext()
  
  const [formData, setFormData] = useState<CreateComboRequest>({
    name: combo?.name || "New Combo",
    description: combo?.description || "",
    bundlePrice: combo?.bundlePrice || 0,
    shouldShowSeparatePrice: combo?.shouldShowSeparatePrice || false,
    status: combo?.status || "active",
    companyId: user?.companyId || "",
    locationId: locationId || user?.locationId || "",
    products: combo?.comboItems?.map(item => ({
      productId: item.productId,
      quantity: item.quantity || 1
    })) || []
  })

  // Product quantities are now stored directly in formData.products

  const isEditing = !!combo

  // Show warning if no catalog is selected
  useEffect(() => {
    if (!selectedCatalog || selectedCatalog === "all") {
      toast({
        title: "Catalog Selection Required",
        description: "Please select a catalog first before creating combos.",
        variant: "destructive",
      })
    }
  }, [selectedCatalog, toast])

  // Fetch locations for dropdown - filter by selected company for POSPORT_ADMIN
  const { data: locationsData } = useLocations(1, 100, "", formData.companyId || undefined)
  const locations = locationsData?.items || []

  useEffect(() => {
    if (locationId) {
      setFormData(prev => ({
        ...prev,
        locationId: locationId
      }))
    }
  }, [locationId])

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
      
      // Validate required fields
      if (!formData.name.trim()) {
        toast({
          title: "Combo Name Required",
          description: "Please enter a name for the combo.",
          variant: "destructive",
        })
        throw new Error("Combo name is required")
      }
      if (!formData.bundlePrice || formData.bundlePrice <= 0) {
        toast({
          title: "Bundle Price Required",
          description: "Please enter a valid bundle price greater than 0.",
          variant: "destructive",
        })
        throw new Error("Bundle price must be greater than 0")
      }
      
      // Ensure bundlePrice is a number
      const bundlePrice = Number(formData.bundlePrice)
      if (isNaN(bundlePrice)) {
        toast({
          title: "Invalid Bundle Price",
          description: "Bundle price must be a valid number.",
          variant: "destructive",
        })
        throw new Error("Bundle price must be a valid number")
      }
      if (formData.products.length === 0) {
        toast({
          title: "Products Required",
          description: "Please select at least one product for the combo.",
          variant: "destructive",
        })
        throw new Error("Please select at least one product")
      }
      
      // Validate products
      console.log('Selected products:', formData.products)
      for (const product of formData.products) {
        if (!product.productId || typeof product.productId !== 'string') {
          toast({
            title: "Invalid Product",
            description: "One or more products have invalid data.",
            variant: "destructive",
          })
          throw new Error("Invalid product ID format")
        }
        if (!product.quantity || product.quantity <= 0) {
          toast({
            title: "Invalid Quantity",
            description: "Product quantity must be greater than 0.",
            variant: "destructive",
          })
          throw new Error("Product quantity must be greater than 0")
        }
      }
      if (!formData.companyId) {
        toast({
          title: "Company Required",
          description: "Company information is required.",
          variant: "destructive",
        })
        throw new Error("Company ID is required")
      }
      
      // Additional validation for POSPORT_ADMIN
      if (shouldFetchCompanies && !formData.companyId) {
        toast({
          title: "Company Selection Required",
          description: "Please select a company.",
          variant: "destructive",
        })
        throw new Error("Please select a company")
      }
      if (!formData.locationId) {
        toast({
          title: "Location Required",
          description: "Please select a catalog first to determine the location.",
          variant: "destructive",
        })
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
      console.log('- Products:', formData.products)

      // Create combo with products array
      const comboData = {
        ...formData,
        bundlePrice: Number(formData.bundlePrice) // Ensure it's a number
      }
      console.log('Sending combo data:', comboData)
      await createCombo(comboData)
      
      // Show success message
      toast({
        title: "Combo Created",
        description: "Combo has been created successfully.",
      })
      
      onSuccess?.()
    } catch (error: any) {
      console.error("Failed to save combo:", error)
      console.error("Error details:", error?.response?.data)
      
      // Show error message if not already shown by validation
      if (!error.message?.includes("required") && !error.message?.includes("must be")) {
        toast({
          title: "Error",
          description: error.message || "Failed to create combo. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const handleInputChange = (field: keyof CreateComboRequest, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleProductToggle = (productId: string) => {
    setFormData(prev => {
      const existingProduct = prev.products.find(p => p.productId === productId)
      if (existingProduct) {
        // Remove product
        return {
          ...prev,
          products: prev.products.filter(p => p.productId !== productId)
        }
      } else {
        // Add product with quantity 1
        return {
          ...prev,
          products: [...prev.products, { productId, quantity: 1 }]
        }
      }
    })
  }

  const handleQuantityChange = (productId: string, quantity: number) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.map(p => 
        p.productId === productId ? { ...p, quantity } : p
      )
    }))
  }

  const selectedProducts = products.filter(product => 
    formData.products.some(p => p.productId === product.id)
  )
  
  // Calculate total items including quantities
  const totalSelectedItems = formData.products.reduce((total, product) => {
    return total + product.quantity
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
          
          {formData.products.length > 0 && (
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
                        {product.retailPrice.toFixed(2)} PKR × {formData.products.find(p => p.productId === product.id)?.quantity || 1}
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
      selectedProductIds={formData.products.map(p => p.productId)}
      onProductToggle={handleProductToggle}
      locationId={formData.locationId}
      selectedProductQuantities={formData.products.reduce((acc, p) => ({ ...acc, [p.productId]: p.quantity }), {})}
      onQuantityChange={handleQuantityChange}
    />
  </>
  )
}
