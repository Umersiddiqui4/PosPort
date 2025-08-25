"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Package, Loader2 } from "lucide-react"
import api from "@/utils/axios"

interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  isAvailable: boolean
}

interface Location {
  id: string
  locationName: string
  address: string
  city: string
  state: string
  company: {
    name: string
  }
}

export default function PublicCatalogPage() {
  const params = useParams()
  const locationId = params?.locationId as string
  
  const [location, setLocation] = useState<Location | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cart, setCart] = useState<{ [key: string]: number }>({})

  useEffect(() => {
    const fetchLocationAndProducts = async () => {
      try {
        setLoading(true)
        
        // Fetch location details
        const locationResponse = await api.get(`/locations/${locationId}`)
        setLocation(locationResponse.data.data)
        
        // Fetch products for this location
        const productsResponse = await api.get(`/locations/${locationId}/products`)
        setProducts(productsResponse.data.data || [])
        
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load catalog")
      } finally {
        setLoading(false)
      }
    }

    if (locationId) {
      fetchLocationAndProducts()
    }
  }, [locationId])

  const addToCart = (productId: string) => {
    setCart(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }))
  }

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const newCart = { ...prev }
      if (newCart[productId] > 1) {
        newCart[productId] -= 1
      } else {
        delete newCart[productId]
      }
      return newCart
    })
  }

  const getCartTotal = () => {
    return products.reduce((total, product) => {
      const quantity = cart[product.id] || 0
      return total + (product.price * quantity)
    }, 0)
  }

  const getCartItemCount = () => {
    return Object.values(cart).reduce((total, quantity) => total + quantity, 0)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading catalog...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Catalog Not Available</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{location?.company?.name}</h1>
              <p className="text-gray-600">{location?.locationName}</p>
              <p className="text-sm text-gray-500">{location?.address}, {location?.city}, {location?.state}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Cart Total</p>
                <p className="text-lg font-semibold text-gray-900">${getCartTotal().toFixed(2)}</p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Cart ({getCartItemCount()})
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Menu</h2>
        
        {products.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Products Available</h3>
            <p className="text-gray-600">This location doesn't have any products in their catalog yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square bg-gray-200 flex items-center justify-center">
                  {product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Package className="w-12 h-12 text-gray-400" />
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-lg font-semibold text-gray-900">{product.name}</CardTitle>
                    <Badge variant={product.isAvailable ? "default" : "secondary"}>
                      {product.isAvailable ? "Available" : "Unavailable"}
                    </Badge>
                  </div>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
                    {product.isAvailable && (
                      <div className="flex items-center gap-2">
                        {cart[product.id] > 0 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeFromCart(product.id)}
                          >
                            -
                          </Button>
                        )}
                        {cart[product.id] > 0 && (
                          <span className="text-sm font-medium w-8 text-center">
                            {cart[product.id]}
                          </span>
                        )}
                        <Button
                          size="sm"
                          onClick={() => addToCart(product.id)}
                          disabled={!product.isAvailable}
                        >
                          {cart[product.id] > 0 ? "+" : "Add"}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
