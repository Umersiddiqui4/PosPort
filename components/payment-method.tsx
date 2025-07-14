"use client"

import { CreditCard, Banknote } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PaymentMethodProps {
  totalAmount: number
  onPaymentSelect: (method: "cash" | "card") => void
  onExactAmount: () => void
}

export default function PaymentMethod({ totalAmount, onPaymentSelect, onExactAmount }: PaymentMethodProps) {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 p-6 min-h-screen">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[#2a3256] mb-4">Total Bill</h2>
        <div className="bg-[#1a72dd] text-white rounded-2xl p-6 shadow-lg">
          <div className="text-4xl font-bold">{totalAmount} PKR</div>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <Button
          variant="outline"
          className="w-full h-20 flex items-center justify-between px-6 text-left bg-white hover:bg-[#1a72dd] hover:text-white border-2 border-gray-200 rounded-2xl transition-all shadow-sm"
          onClick={() => onPaymentSelect("cash")}
        >
          <div className="flex items-center gap-4">
            <Banknote className="w-8 h-8 text-[#1a72dd]" />
            <span className="text-xl font-semibold">Cash Payment</span>
          </div>
          <span className="text-[#1a72dd] font-bold text-lg">CASH</span>
        </Button>

        <Button
          variant="outline"
          className="w-full h-20 flex items-center justify-between px-6 text-left bg-white hover:bg-[#1a72dd] hover:text-white border-2 border-gray-200 rounded-2xl transition-all shadow-sm"
          onClick={() => onPaymentSelect("card")}
        >
          <div className="flex items-center gap-4">
            <CreditCard className="w-8 h-8 text-[#1a72dd]" />
            <span className="text-xl font-semibold">Card Payment</span>
          </div>
          <div className="flex gap-2">
            {/* <div className="w-10 h-6 hidden bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
              JCB
            </div> */}
            <div className="w-10 h-6 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">
              MC
            </div>
            <div className="w-10 h-6 bg-blue-800 rounded text-white text-xs flex items-center justify-center font-bold">
              VISA
            </div>
          </div>
        </Button>
      </div>

      <Button
        className="w-full h-16 bg-gradient-to-r from-[#1a72dd] to-blue-600 hover:from-[#1a72dd]/90 hover:to-blue-600/90 text-xl font-bold rounded-2xl shadow-lg mb-6"
        onClick={onExactAmount}
      >
        EXACT AMOUNT
      </Button>

      <div className="text-center bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
        <p className="text-sm text-[#545454] mb-1">Input Price</p>
        <p className="text-2xl font-bold text-[#2a3256]">Rs 0</p>
      </div>
    </div>
  )
}
