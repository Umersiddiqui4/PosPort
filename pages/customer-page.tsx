"use client"

import type React from "react"

import { useState } from "react"
import { Search, Plus, Phone, Mail, MapPin, User, MoreVertical, X, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface CustomerPageProps {
  onMobileToggle?: () => void
}

interface Customer {
  id: number
  name: string
  email: string
  phone: string
  address: string
  totalOrders: number
  totalSpent: number
  lastOrder: string
  status: "Active" | "Inactive"
}

const customers: Customer[] = [
  {
    id: 1,
    name: "Ahmed Ali",
    email: "ahmed.ali@email.com",
    phone: "+92 300 1234567",
    address: "Block A, Gulshan-e-Iqbal, Karachi",
    totalOrders: 15,
    totalSpent: 25000,
    lastOrder: "2023-11-20",
    status: "Active",
  },
  {
    id: 2,
    name: "Fatima Khan",
    email: "fatima.khan@email.com",
    phone: "+92 301 2345678",
    address: "DHA Phase 2, Lahore",
    totalOrders: 8,
    totalSpent: 12000,
    lastOrder: "2023-11-18",
    status: "Active",
  },
  {
    id: 3,
    name: "Hassan Sheikh",
    email: "hassan.sheikh@email.com",
    phone: "+92 302 3456789",
    address: "F-10 Markaz, Islamabad",
    totalOrders: 22,
    totalSpent: 35000,
    lastOrder: "2023-11-22",
    status: "Active",
  },
  {
    id: 4,
    name: "Ayesha Malik",
    email: "ayesha.malik@email.com",
    phone: "+92 303 4567890",
    address: "Clifton Block 5, Karachi",
    totalOrders: 3,
    totalSpent: 4500,
    lastOrder: "2023-10-15",
    status: "Inactive",
  },
]

function AddCustomerModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically save the customer
    console.log("Adding customer:", formData)
    onClose()
    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      notes: "",
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden">
        <div className="bg-[#1a72dd] text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Add New Customer</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20 rounded-full">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-96 overflow-y-auto">
          <div>
            <Label htmlFor="name" className="text-sm font-medium text-[#2a3256]">
              Full Name
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter customer name"
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-sm font-medium text-[#2a3256]">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="customer@email.com"
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="phone" className="text-sm font-medium text-[#2a3256]">
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+92 300 1234567"
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="address" className="text-sm font-medium text-[#2a3256]">
              Address
            </Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Enter customer address"
              className="mt-1"
              rows={2}
              required
            />
          </div>

          <div>
            <Label htmlFor="notes" className="text-sm font-medium text-[#2a3256]">
              Notes (Optional)
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any additional notes about the customer"
              className="mt-1"
              rows={2}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-[#1a72dd] hover:bg-[#1557b8]">
              Add Customer
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function CustomerPage({ onMobileToggle }: CustomerPageProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery),
  )

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
          <h1 className="text-lg sm:text-xl font-bold text-[#1a72dd] flex-1 text-center">Customers</h1>
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-[#1a72dd] hover:bg-[#1557b8] text-white rounded-xl px-3 sm:px-4 py-2"
          >
            <Plus className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Add Customer</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 border-2 border-gray-200 rounded-xl font-medium focus:border-[#1a72dd] bg-white"
          />
        </div>
      </header>

      {/* Customer List */}
      <div className="flex-1 overflow-auto p-3 sm:p-4">
        <div className="space-y-3">
          {filteredCustomers.map((customer) => (
            <div
              key={customer.id}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-lg hover:border-[#1a72dd]/20 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#1a72dd] to-[#1557b8] rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[#2a3256] text-base mb-1">{customer.name}</h3>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-[#545454]">
                          <Mail className="w-3 h-3" />
                          <span className="truncate">{customer.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[#545454]">
                          <Phone className="w-3 h-3" />
                          <span>{customer.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[#545454]">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">{customer.address}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 ml-3">
                      <Badge
                        variant={customer.status === "Active" ? "default" : "secondary"}
                        className={`${
                          customer.status === "Active"
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : "bg-red-100 text-red-800 hover:bg-red-100"
                        }`}
                      >
                        {customer.status}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8 text-[#545454] hover:bg-gray-100 rounded-lg"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-100">
                    <div className="text-center">
                      <div className="text-lg font-bold text-[#1a72dd]">{customer.totalOrders}</div>
                      <div className="text-xs text-[#545454]">Orders</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-[#1a72dd]">{customer.totalSpent.toLocaleString()}</div>
                      <div className="text-xs text-[#545454]">PKR Spent</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-semibold text-[#2a3256]">{customer.lastOrder}</div>
                      <div className="text-xs text-[#545454]">Last Order</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCustomers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <User className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-[#2a3256] mb-2">No customers found</h3>
            <p className="text-[#545454]">Try adjusting your search criteria</p>
          </div>
        )}
      </div>

      <AddCustomerModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
    </div>
  )
}
