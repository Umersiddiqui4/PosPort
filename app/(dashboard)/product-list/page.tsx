"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Plus, Grid, List, Package, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useProducts } from "@/hooks/use-products"
import type { Product } from "@/hooks/use-products"
import CompactBarcode from "@/components/compact-barcode"

export default function ProductList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [currentPage] = useState(1)
  const [locationId] = useState<string | undefined>(undefined)
  
  const router = useRouter()
  
  // Fetch products
  const { products, isLoading, error } = useProducts(currentPage, 50, locationId)
  
  // Filter products based on search and filters
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || product.status === selectedStatus
    return matchesSearch && matchesStatus
  })



  const handleProductClick = (product: Product) => {
    if (product.id) {
      router.push(`/product-list/${product.id}`)
    }
  }

  const handleCreateProduct = () => {
    router.push("/product-list/create")
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-600">Error loading products. Please try again.</div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6 h-full overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Product Management</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage and view all your products
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="h-8 w-8 p-0"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="h-8 w-8 p-0"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
          <Button onClick={handleCreateProduct} className="bg-[#1a72dd] hover:bg-[#1557b8]">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="w-5 h-5 text-[#1a72dd]" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Products</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{products.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Active Products</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {products.filter(p => p.status === "active").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Categories</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">0</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">In Stock</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {products.filter(p => (p.stock || 0) > 0).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search products by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Products Grid/List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1a72dd]"></div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-8 text-center">
            <Package className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No products found</h3>
            <p className="text-gray-600 dark:text-gray-300">
              {searchTerm || selectedStatus !== "all"
                ? "Try adjusting your search or filter criteria."
                : "Get started by adding your first product."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className={
          viewMode === "grid" 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-4"
        }>
          {filteredProducts.map((product) => (
            <Card 
              key={product.id}
              className="hover:shadow-lg transition-all duration-300 cursor-pointer dark:bg-gray-800 dark:border-gray-700 group"
              onClick={() => handleProductClick(product)}
            >
              <CardContent className="p-4">
                {viewMode === "grid" ? (
                  <div className="space-y-3">
                    <div className="relative aspect-square overflow-hidden rounded-lg">
                      <img
                        src={product.attachments?.[0]?.url || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                      <div className="absolute top-2 right-2">
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
                    <div className="space-y-2">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-[#1a72dd] transition-colors">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-[#1a72dd] dark:text-blue-400">
                          {product.retailPrice} PKR
                        </span>
                      </div>
                      {/* Demo Barcode - Replace with actual tracking details when available */}
                      <div className="mt-2">
                        <CompactBarcode 
                          value={product.id || "DEMO-123"} 
                          width={1}
                          height={30}
                          fontSize={8}
                          showText={false}
                          className="bg-white p-2 rounded border"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-4">
                    <div className="relative w-16 h-16 overflow-hidden rounded-lg flex-shrink-0">
                      <img
                        src={product.attachments?.[0]?.url || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-[#1a72dd] transition-colors">
                            {product.name}
                          </h3>
                          {product.description && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                              {product.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 ml-4">
                          <div className="text-right">
                            <p className="text-lg font-bold text-[#1a72dd] dark:text-blue-400">
                              {product.retailPrice} PKR
                            </p>
                          </div>
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
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleProductClick(product)
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
