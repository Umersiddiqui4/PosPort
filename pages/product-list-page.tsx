"use client"

import type React from "react"

import { useState } from "react"
import { Search, Plus, Edit, Trash2, MoreVertical, X, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface ProductListPageProps {
  onMobileToggle?: () => void
}

interface Product {
  id: number
  name: string
  category: string
  price: number
  stock: number
  status: "Active" | "Inactive"
  image: string
}

const products: Product[] = [
  {
    id: 1,
    name: "Chicken Biryani",
    category: "Special Menu",
    price: 2000,
    stock: 25,
    status: "Active",
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 2,
    name: "Beef Karahi",
    category: "Main Course",
    price: 1800,
    stock: 15,
    status: "Active",
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 3,
    name: "Fish Curry",
    category: "Special Menu",
    price: 1200,
    stock: 8,
    status: "Inactive",
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 4,
    name: "Maggi Black Paper",
    category: "Main Course",
    price: 1500,
    stock: 30,
    status: "Active",
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 5,
    name: "Pepperoni Pizza",
    category: "Fast Food",
    price: 1600,
    stock: 12,
    status: "Active",
    image: "/placeholder.svg?height=60&width=60",
  },
]

function AddProductModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    status: "Active",
    description: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically save the product
    console.log("Adding product:", formData)
    onClose()
    // Reset form
    setFormData({
      name: "",
      category: "",
      price: "",
      stock: "",
      status: "Active",
      description: "",
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden">
        <div className="bg-[#1a72dd] text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Add New Product</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20 rounded-full">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-96 overflow-y-auto">
          <div>
            <Label htmlFor="name" className="text-sm font-medium text-[#2a3256]">
              Product Name
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter product name"
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="category" className="text-sm font-medium text-[#2a3256]">
              Category
            </Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Special Menu">Special Menu</SelectItem>
                <SelectItem value="Main Course">Main Course</SelectItem>
                <SelectItem value="Fast Food">Fast Food</SelectItem>
                <SelectItem value="Beverages">Beverages</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price" className="text-sm font-medium text-[#2a3256]">
                Price (PKR)
              </Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0"
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="stock" className="text-sm font-medium text-[#2a3256]">
                Stock
              </Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                placeholder="0"
                className="mt-1"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="status" className="text-sm font-medium text-[#2a3256]">
              Status
            </Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description" className="text-sm font-medium text-[#2a3256]">
              Description (Optional)
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter product description"
              className="mt-1"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-[#1a72dd] hover:bg-[#1557b8]">
              Add Product
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function ProductListPage({ onMobileToggle }: ProductListPageProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [showAddModal, setShowAddModal] = useState(false)

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
    const matchesStatus = selectedStatus === "All" || product.status === selectedStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-[#f7f8fa] to-[#e8f4fd]">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md p-3 sm:p-4 border-b border-gray-200/50 shadow-sm">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-center gap-3">
            {onMobileToggle && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onMobileToggle}
                className="text-[#1a72dd] hover:bg-[#1a72dd]/10 rounded-xl transition-all duration-200"
                aria-label="Toggle menu"
              >
                <Menu className="w-5 h-5" />
              </Button>
            )}
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-[#1a72dd] flex-1 text-center">Product List</h1>
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-[#1a72dd] hover:bg-[#1557b8] text-white rounded-xl px-3 sm:px-4 py-2"
          >
            <Plus className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Add Product</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 border-2 border-gray-200 rounded-xl font-medium focus:border-[#1a72dd] bg-white"
            />
          </div>

          <div className="flex gap-3">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="flex-1 h-10 border-2 border-gray-200 rounded-xl font-medium focus:border-[#1a72dd] bg-white">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                <SelectItem value="Special Menu">Special Menu</SelectItem>
                <SelectItem value="Main Course">Main Course</SelectItem>
                <SelectItem value="Fast Food">Fast Food</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="flex-1 h-10 border-2 border-gray-200 rounded-xl font-medium focus:border-[#1a72dd] bg-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      {/* Product List */}
      <div className="flex-1 overflow-auto p-3 sm:p-4">
        <div className="space-y-3">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-lg hover:border-[#1a72dd]/20 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[#2a3256] text-base mb-1 truncate">{product.name}</h3>
                      <p className="text-sm text-[#545454] mb-2">{product.category}</p>
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-[#1a72dd]">{product.price} PKR</span>
                        <span className="text-sm text-[#545454]">Stock: {product.stock}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 ml-3">
                      <Badge
                        variant={product.status === "Active" ? "default" : "secondary"}
                        className={`${
                          product.status === "Active"
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : "bg-red-100 text-red-800 hover:bg-red-100"
                        }`}
                      >
                        {product.status}
                      </Badge>

                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-8 h-8 text-[#1a72dd] hover:bg-[#1a72dd]/10 rounded-lg"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="w-8 h-8 text-red-500 hover:bg-red-50 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-8 h-8 text-[#545454] hover:bg-gray-100 rounded-lg"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-[#2a3256] mb-2">No products found</h3>
            <p className="text-[#545454]">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      <AddProductModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
    </div>
  )
}
