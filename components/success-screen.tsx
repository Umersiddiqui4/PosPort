"use client"

import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SuccessScreenProps {
  onPrintReceipt: () => void
  onNextOrder: () => void
}

export default function SuccessScreen({ onPrintReceipt, onNextOrder }: SuccessScreenProps) {
  return (
    <div className="bg-gradient-to-br from-[#1a72dd] to-blue-600 min-h-screen flex flex-col items-center justify-center p-6 text-white">
      <div className="bg-white rounded-full p-8 mb-8 shadow-2xl">
        <CheckCircle className="w-20 h-20 text-[#1a72dd]" />
      </div>

      <h1 className="text-3xl font-bold mb-3">Successful Transaction!</h1>
      <p className="text-center mb-10 opacity-90 text-lg">NOTE: Do not forget to give order to customer</p>

      <div className="w-full max-w-sm space-y-6">
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/30">
          <p className="font-semibold text-lg mb-2">Method Payment: Cash</p>
          <p className="text-sm opacity-90">Change Customer: 300 PKR</p>
        </div>

        <Button
          variant="outline"
          className="w-full h-14 bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#1a72dd] rounded-2xl font-semibold text-lg transition-all"
          onClick={onPrintReceipt}
        >
          PRINT RECEIPT
        </Button>

        <Button
          className="w-full h-14 bg-white text-[#1a72dd] hover:bg-white/90 font-bold text-lg rounded-2xl shadow-lg"
          onClick={onNextOrder}
        >
          NEXT ORDER
        </Button>

        <div className="text-center pt-6">
          <p className="text-sm opacity-75 bg-white/10 rounded-full px-4 py-2 inline-block">SMS RECEIPT</p>
        </div>
      </div>
    </div>
  )
}
