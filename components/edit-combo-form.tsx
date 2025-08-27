import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Minus, X } from 'lucide-react'
import { useProducts } from '@/hooks/use-products'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useLocations } from '@/hooks/useLocation'
import { useComboOperations } from '@/hooks/use-combo-operations'
import { Combo } from '@/hooks/use-combos'
import { Product } from '@/hooks/use-products'
import ProductSelectionPopup from './product-selection-popup'
import { useQuery } from '@tanstack/react-query'
import { getCompanies } from '@/lib/Api/getCompanies'

interface EditComboFormProps {
  combo: Combo
  onSuccess: () => void
  onCancel: () => void
}

export const EditComboForm: React.FC<EditComboFormProps> = ({ combo, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: combo.name || '',
    description: combo.description || '',
    bundlePrice: combo.bundlePrice || 0,
    shouldShowSeparatePrice: combo.shouldShowSeparatePrice || false,
    status: combo.status || 'active',
    companyId: combo.companyId || '',
    locationId: combo.locationId || '',
    products: combo.comboItems && Array.isArray(combo.comboItems) 
      ? combo.comboItems.filter(item => item && item.productId).map(item => ({
          productId: item.productId,
          quantity: item.quantity || 1,
          comboItemId: item.id // Store the original combo item ID for updates
        }))
      : []
  })

  const [isProductSelectionOpen, setIsProductSelectionOpen] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([])

  const { user } = useCurrentUser()
  const { 
    updateComboBasic, 
    addComboItem, 
    updateComboItem, 
    deleteComboItem,
    isUpdatingBasic, 
    isAddingItem, 
    isUpdatingItem, 
    isDeletingItem 
  } = useComboOperations()
  // Remove catalog fetch since we don't need it for editing combos
  const { data: locationsData } = useLocations(1, 100, undefined, combo.companyId)
  const locations = locationsData?.items || []
  const { products } = useProducts(1, 100, combo.locationId)

  // Fetch companies for POSPORT_ADMIN users
  const shouldFetchCompanies = user?.role === "POSPORT_ADMIN"
  const { data: companiesResponse, error: companiesError } = useQuery({
    queryKey: ['companies'],
    queryFn: getCompanies,
    enabled: shouldFetchCompanies,
  })
  const companies = companiesResponse?.data || []

  // Product quantities are now stored directly in formData.products

  // Initialize selected products from existing combo items
  useEffect(() => {
    if (combo.comboItems && Array.isArray(combo.comboItems)) {
      const products = combo.comboItems
        .filter(item => item && item.product)
        .map(item => item.product)
      setSelectedProducts(products)
    }
  }, [combo])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
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
        // Add product with quantity 1 (no comboItemId for new products)
        const productToAdd = products?.find(p => p.id === productId)
        if (productToAdd) {
          setSelectedProducts(prev => [...prev, productToAdd])
          return {
            ...prev,
            products: [...prev.products, { productId, quantity: 1 }]
          }
        }
      }
      return prev
    })
  }

  const handleQuantityChange = (productId: string, quantity: number) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.map(p => 
        p.productId === productId ? { ...p, quantity: Math.max(1, quantity) } : p
      )
    }))
  }

  const totalSelectedItems = formData.products.reduce((sum, product) => sum + product.quantity, 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Validation
      if (!formData.name.trim()) {
        throw new Error("Combo name is required")
      }
      if (!formData.description.trim()) {
        throw new Error("Combo description is required")
      }
      if (!formData.bundlePrice || formData.bundlePrice <= 0) {
        throw new Error("Bundle price must be greater than 0")
      }
      if (formData.products.length === 0) {
        throw new Error("At least one product must be selected")
      }

      const bundlePrice = Number(formData.bundlePrice)
      if (isNaN(bundlePrice)) {
        throw new Error("Invalid bundle price")
      }

      console.log('Updating combo with segmented approach:', {
        id: combo.id,
        formData,
        user: user?.role
      })

      // Step 1: Update basic combo info (non-products)
      const basicUpdateData = {
        name: formData.name,
        description: formData.description,
        bundlePrice: bundlePrice,
        shouldShowSeparatePrice: formData.shouldShowSeparatePrice,
        status: formData.status
      }

      await updateComboBasic(combo.id, basicUpdateData)

      // Step 2: Handle product changes
      const originalItems = combo.comboItems || []
      const currentItems = formData.products

      // Find items to update (existing items with quantity changes)
      const itemsToUpdate = currentItems.filter(current => 
        current.comboItemId && 
        originalItems.find(original => 
          original.id === current.comboItemId && 
          original.quantity !== current.quantity
        )
      )

      // Find items to add (new items without comboItemId)
      const itemsToAdd = currentItems.filter(current => !current.comboItemId)

      // Find items to delete (original items not in current items)
      const itemsToDelete = originalItems.filter(original => 
        !currentItems.find(current => current.comboItemId === original.id)
      )

      console.log('Product changes:', {
        itemsToUpdate,
        itemsToAdd,
        itemsToDelete
      })

      // Update existing items
      for (const item of itemsToUpdate) {
        await updateComboItem(combo.id, item.comboItemId!, { quantity: item.quantity })
      }

      // Add new items
      for (const item of itemsToAdd) {
        await addComboItem(combo.id, { productId: item.productId, quantity: item.quantity })
      }

      // Delete removed items
      for (const item of itemsToDelete) {
        await deleteComboItem(combo.id, item.id)
      }

      onSuccess()
    } catch (error: any) {
      console.error('Failed to update combo:', error)
      throw error
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Combo Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter combo name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bundlePrice">Bundle Price (PKR) *</Label>
          <Input
            id="bundlePrice"
            type="number"
            step="0.01"
            min="0"
            value={formData.bundlePrice}
            onChange={(e) => handleInputChange('bundlePrice', parseFloat(e.target.value) || 0)}
            placeholder="0.00"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Enter combo description"
          rows={3}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="shouldShowSeparatePrice"
            checked={formData.shouldShowSeparatePrice}
            onCheckedChange={(checked) => handleInputChange('shouldShowSeparatePrice', checked)}
          />
          <Label htmlFor="shouldShowSeparatePrice">Show separate price</Label>
        </div>
      </div>

      {/* Company Selection for POSPORT_ADMIN */}
      {shouldFetchCompanies && (
        <div className="space-y-2">
          <Label htmlFor="company">Company *</Label>
          <Select 
            value={formData.companyId} 
            onValueChange={(value) => handleInputChange('companyId', value)}
            disabled
          >
            <SelectTrigger>
              <SelectValue placeholder="Select company" />
            </SelectTrigger>
            <SelectContent>
              {companies && Array.isArray(companies) && companies.length > 0 ? (
                companies.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectItem>
                ))
              ) : (
                <div className="px-2 py-1.5 text-sm text-gray-500">
                  No companies available
                </div>
              )}
            </SelectContent>
          </Select>
          <p className="text-sm text-gray-500">Company cannot be changed for existing combos</p>
        </div>
      )}

      {/* Location Selection */}
      <div className="space-y-2">
        <Label htmlFor="location">Location *</Label>
        <Select 
          value={formData.locationId} 
          onValueChange={(value) => handleInputChange('locationId', value)}
          disabled
        >
          <SelectTrigger>
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent>
            {locations.length === 0 ? (
              <div className="px-2 py-1.5 text-sm text-gray-500">
                No locations available
              </div>
            ) : (
              locations.map((location) => (
                <SelectItem key={location.id} value={location.id}>
                  {location.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        <p className="text-sm text-gray-500">Location cannot be changed for existing combos</p>
      </div>

      {/* Product Selection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Products *</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsProductSelectionOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Products
          </Button>
        </div>

        {formData.products.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">
                Selected Products ({selectedProducts.length} products, {totalSelectedItems} items total)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {formData.products.map((productData) => {
                  const product = selectedProducts.find(p => p.id === productData.productId)
                  if (!product) return null
                  return (
                  <div key={product.id} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center space-x-3">
                      {product.attachments?.[0]?.url && (
                        <img
                          src={product.attachments[0].url}
                          alt={product.productName}
                          className="w-8 h-8 object-cover rounded"
                        />
                      )}
                      <div>
                        <p className="font-medium text-sm">{product.productName}</p>
                        <p className="text-xs text-gray-500">
                          {product.retailPrice.toFixed(2)} PKR × {productData.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(product.id, productData.quantity - 1)}
                        disabled={productData.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm w-8 text-center">{productData.quantity}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(product.id, productData.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleProductToggle(product.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )})}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isUpdatingBasic || isAddingItem || isUpdatingItem || isDeletingItem}>
          {isUpdatingBasic || isAddingItem || isUpdatingItem || isDeletingItem ? 'Updating...' : 'Update Combo'}
        </Button>
      </div>

      {/* Product Selection Popup */}
      <ProductSelectionPopup
        isOpen={isProductSelectionOpen}
        onClose={() => setIsProductSelectionOpen(false)}
        selectedProductIds={formData.products.map(p => p.productId)}
        onProductToggle={handleProductToggle}
        selectedProductQuantities={formData.products.reduce((acc, p) => ({ ...acc, [p.productId]: p.quantity }), {})}
        onQuantityChange={handleQuantityChange}
        locationId={formData.locationId}
      />
    </form>
  )
}
