"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

interface OrderSummaryProps {
  items: CartItem[]
  total: number
  onClose: () => void
  onProceedToPayment: () => void
}

export default function OrderSummary({ items, total, onClose, onProceedToPayment }: OrderSummaryProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden">
        <div className="bg-[#1a72dd] text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Order Summary</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20 rounded-full">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-4 max-h-96 overflow-y-auto">
          {items.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No items in cart</p>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#2a3256]">{item.name}</h3>
                    <p className="text-sm text-gray-600">
                      {item.quantity} × {item.price} PKR
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#1a72dd]">{item.quantity * item.price} PKR</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 p-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold">Total:</span>
            <span className="text-2xl font-bold text-[#1a72dd]">{total} PKR</span>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-300 hover:bg-gray-50 bg-transparent"
            >
              Continue Shopping
            </Button>
            <Button
              onClick={onProceedToPayment}
              className="flex-1 bg-[#1a72dd] hover:bg-[#1557b8]"
              disabled={items.length === 0}
            >
              Proceed to Payment
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
