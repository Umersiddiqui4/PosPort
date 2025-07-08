"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Delete } from "lucide-react"

interface NumericKeypadProps {
  onValueChange: (value: string) => void
  onEnter: () => void
  title: string
}

export default function NumericKeypad({ onValueChange, onEnter, title }: NumericKeypadProps) {
  const [value, setValue] = useState("")

  const handleNumberClick = (num: string) => {
    const newValue = value + num
    setValue(newValue)
    onValueChange(newValue)
  }

  const handleClear = () => {
    setValue("")
    onValueChange("")
  }

  const handleDelete = () => {
    const newValue = value.slice(0, -1)
    setValue(newValue)
    onValueChange(newValue)
  }

  const handleEnter = () => {
    onEnter()
    setValue("")
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 p-6 min-h-screen">
      <h2 className="text-2xl font-bold text-[#2a3256] mb-6 text-center">{title}</h2>

      <div className="mb-8">
        <div className="text-4xl font-bold text-center p-6 bg-white rounded-2xl shadow-sm border-2 border-[#1a72dd]/20 min-h-[80px] flex items-center justify-center text-[#1a72dd]">
          {value || "0"}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <Button
            key={num}
            variant="outline"
            className="h-16 text-xl font-bold bg-white hover:bg-[#1a72dd] hover:text-white border-2 border-gray-200 rounded-xl transition-all"
            onClick={() => handleNumberClick(num.toString())}
          >
            {num}
          </Button>
        ))}

        <Button
          variant="outline"
          className="h-16 text-xl font-bold bg-white hover:bg-red-500 hover:text-white border-2 border-gray-200 rounded-xl transition-all"
          onClick={handleClear}
        >
          C
        </Button>

        <Button
          variant="outline"
          className="h-16 text-xl font-bold bg-white hover:bg-[#1a72dd] hover:text-white border-2 border-gray-200 rounded-xl transition-all"
          onClick={() => handleNumberClick("0")}
        >
          0
        </Button>

        <Button
          variant="outline"
          className="h-16 text-xl font-bold bg-white hover:bg-[#1a72dd] hover:text-white border-2 border-gray-200 rounded-xl transition-all"
          onClick={() => handleNumberClick("00")}
        >
          000
        </Button>
      </div>

      <div className="flex gap-4">
        <Button
          variant="outline"
          className="flex-1 h-14 bg-white hover:bg-orange-500 hover:text-white border-2 border-gray-200 rounded-xl transition-all"
          onClick={handleDelete}
        >
          <Delete className="w-5 h-5" />
        </Button>

        <Button
          className="flex-1 h-14 bg-[#1a72dd] hover:bg-[#1a72dd]/90 text-xl font-bold rounded-xl shadow-lg"
          onClick={handleEnter}
        >
          ENTER
        </Button>
      </div>
    </div>
  )
}
