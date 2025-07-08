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
    <div className="bg-[#1a72dd] text-white p-4 flex items-center justify-between fixed bottom-0 left-0 right-0 z-30 shadow-lg">
      <div className="flex items-center gap-3">
        <ShoppingCart className="w-5 h-5" />
        <span className="font-medium">{totalItems} Items</span>
        <span className="font-bold">Total: {total} PKR</span>
      </div>

      <Button className="bg-white text-[#1a72dd] hover:bg-white/90 font-semibold px-6" onClick={onCheckout}>
        CHECKOUT
      </Button>
    </div>
  )
}
