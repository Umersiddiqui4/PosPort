"use client"

import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
}

interface CartSummaryProps {
  items: CartItem[]
  total: number
  onCheckout: () => void
}

export default function CartSummary({ items, total, onCheckout }: CartSummaryProps) {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="bg-[#1a72dd] text-white p-3 sm:p-4 flex items-center justify-between fixed bottom-0 right-0 z-30 shadow-lg transition-all duration-300 left-0 md:left-80">
      <div className="flex items-center gap-2 sm:gap-3">
        <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="font-medium text-sm sm:text-base">{totalItems} Items</span>
        <span className="font-bold text-sm sm:text-base">Total: {total} PKR</span>
      </div>

      <Button
        className="bg-white text-[#1a72dd] hover:bg-white/90 font-semibold px-4 sm:px-6 text-sm sm:text-base"
        onClick={onCheckout}
      >
        CHECKOUT
      </Button>
    </div>
  )
}
