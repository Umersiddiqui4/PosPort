"use client"

import { useState, useEffect } from "react"
import { X, Search, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useProducts } from "@/hooks/use-products"
import { useLocations } from "@/hooks/useLocation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Using the Product interface from useProducts hook
import { Product } from "@/hooks/use-products"

interface ProductSelectionPopupProps {
  isOpen: boolean
  onClose: () => void
  selectedProductIds: string[]
  onProductToggle: (productId: string) => void
  locationId?: string
  selectedProductQuantities?: Record<string, number>
  onQuantityChange?: (productId: string, quantity: number) => void
}

export default function ProductSelectionPopup({
  isOpen,
  onClose,
  selectedProductIds,
  onProductToggle,
  locationId,
  selectedProductQuantities = {},
  onQuantityChange
}: ProductSelectionPopupProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLocationId, setSelectedLocationId] = useState(locationId || "")
  
  // Fetch locations for dropdown
  const { data: locationsData } = useLocations(1, 100)
  const locations = locationsData?.items || []
  
  // Fetch products based on selected location
  const { products, isLoading } = useProducts(1, 100, selectedLocationId || undefined)
  
  // Filter products based on search term and location
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  useEffect(() => {
    if (locationId && !selectedLocationId) {
      setSelectedLocationId(locationId)
    }
  }, [locationId, selectedLocationId])

  const handleProductToggle = (productId: string) => {
    onProductToggle(productId)
  }

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (onQuantityChange) {
      onQuantityChange(productId, newQuantity)
    }
  }

  const isProductSelected = (productId: string) => selectedProductIds.includes(productId)
  const getProductQuantity = (productId: string) => selectedProductQuantities[productId] || 1

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Select Products for Combo
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Location Selection */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Select Location *
            </label>
            <Select
              value={selectedLocationId}
              onValueChange={setSelectedLocationId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location.id} value={location.id}>
                    {location.locationName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {!selectedLocationId ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                Please select a location to view available products
              </p>
            </div>
          ) : isLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm ? "No products found matching your search" : "No products available in this location"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product) => {
                const isSelected = isProductSelected(product.id)
                const productImage = product.attachments?.[0]?.url || "/placeholder.jpg"
                
                return (
                  <Card
                    key={product.id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                      isSelected 
                        ? 'ring-2 ring-[#1a72dd] shadow-lg' 
                        : 'opacity-60 hover:opacity-80'
                    }`}
                    onClick={() => handleProductToggle(product.id)}
                  >
                    <CardContent className="p-4">
                      {/* Product Image */}
                      <div className="relative mb-3">
                        <img
                          src={productImage}
                          alt={product.name}
                          className={`w-full h-32 object-cover rounded-lg transition-all duration-200 ${
                            isSelected ? 'brightness-100' : 'brightness-75'
                          }`}
                        />
                        {isSelected && (
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-[#1a72dd] text-white">
                              Qty: {getProductQuantity(product.id)}
                            </Badge>
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="space-y-2">
                        <h3 className={`font-semibold text-sm transition-all duration-200 ${
                          isSelected ? 'text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-400'
                        }`}>
                          {product.name}
                        </h3>
                        <p className={`text-lg font-bold transition-all duration-200 ${
                          isSelected ? 'text-[#1a72dd]' : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {product.retailPrice.toFixed(2)} PKR
                        </p>
                        {product.description && (
                          <p className={`text-xs text-gray-500 dark:text-gray-400 line-clamp-2 transition-all duration-200 ${
                            isSelected ? 'opacity-100' : 'opacity-60'
                          }`}>
                            {product.description}
                          </p>
                        )}
                        
                        {/* Quantity Controls - Only show when product is selected */}
                        {isSelected && onQuantityChange && (
                          <div className="flex items-center justify-center gap-2 mt-3">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                const currentQty = getProductQuantity(product.id)
                                if (currentQty > 1) {
                                  handleQuantityChange(product.id, currentQty - 1)
                                }
                              }}
                              className="w-8 h-8 p-0 rounded-full"
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="text-sm font-medium min-w-[20px] text-center">
                              {getProductQuantity(product.id)}
                            </span>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                const currentQty = getProductQuantity(product.id)
                                handleQuantityChange(product.id, currentQty + 1)
                              }}
                              className="w-8 h-8 p-0 rounded-full"
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {selectedProductIds.length} product{selectedProductIds.length !== 1 ? 's' : ''} selected
              {Object.keys(selectedProductQuantities).length > 0 && (
                <span className="ml-2">
                  ({Object.values(selectedProductQuantities).reduce((sum, qty) => sum + qty, 0)} items total)
                </span>
              )}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                onClick={onClose}
                className="bg-[#1a72dd] hover:bg-[#1557b8]"
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
