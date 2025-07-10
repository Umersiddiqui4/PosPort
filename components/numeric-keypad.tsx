"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Delete } from "lucide-react"
import { Input } from "@/components/ui/input"

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/[^0-9]/g, "")
    setValue(newValue)
    onValueChange(newValue)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleEnter()
    } else if (e.key === "Backspace") {
      handleDelete()
    } else if (e.key === "Escape") {
      handleClear()
    }
  }

  useEffect(() => {
    const handleGlobalKeyPress = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") {
        handleNumberClick(e.key)
      } else if (e.key === "Enter") {
        handleEnter()
      } else if (e.key === "Backspace") {
        handleDelete()
      } else if (e.key === "Escape") {
        handleClear()
      }
    }

    window.addEventListener("keydown", handleGlobalKeyPress)
    return () => window.removeEventListener("keydown", handleGlobalKeyPress)
  }, [value])

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 p-4 sm:p-6 min-h-screen">
      <h2 className="text-xl sm:text-2xl font-bold text-[#2a3256] mb-4 sm:mb-6 text-center">{title}</h2>

      <div className="mb-6 sm:mb-8">
        <Input
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          placeholder="Enter amount"
          className="text-7xl md:text-4xl sm:text-4xl font-bold text-center p-4 sm:p-6 bg-white rounded-2xl shadow-sm border-2 border-[#1a72dd]/20 min-h-[60px] sm:min-h-[80px] text-[#1a72dd] focus:border-[#1a72dd]"
          autoFocus
        />
      </div>

      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <Button
            key={num}
            variant="outline"
            className="h-12 sm:h-16 text-lg sm:text-xl font-bold bg-white hover:bg-[#1a72dd] hover:text-white border-2 border-gray-200 rounded-xl transition-all"
            onClick={() => handleNumberClick(num.toString())}
          >
            {num}
          </Button>
        ))}

        <Button
          variant="outline"
          className="h-12 sm:h-16 text-lg sm:text-xl font-bold bg-white hover:bg-red-500 hover:text-white border-2 border-gray-200 rounded-xl transition-all"
          onClick={handleClear}
        >
          C
        </Button>

        <Button
          variant="outline"
          className="h-12 sm:h-16 text-lg sm:text-xl font-bold bg-white hover:bg-[#1a72dd] hover:text-white border-2 border-gray-200 rounded-xl transition-all"
          onClick={() => handleNumberClick("0")}
        >
          0
        </Button>

        <Button
          variant="outline"
          className="h-12 sm:h-16 text-lg sm:text-xl font-bold bg-white hover:bg-[#1a72dd] hover:text-white border-2 border-gray-200 rounded-xl transition-all"
          onClick={() => handleNumberClick("00")}
        >
          000
        </Button>
      </div>

      <div className="flex gap-3 sm:gap-4">
        <Button
          variant="outline"
          className="flex-1 h-12 sm:h-14 bg-white hover:bg-orange-500 hover:text-white border-2 border-gray-200 rounded-xl transition-all"
          onClick={handleDelete}
        >
          <Delete className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>

        <Button
          className="flex-1 h-12 sm:h-14 bg-[#1a72dd] hover:bg-[#1a72dd]/90 text-lg sm:text-xl font-bold rounded-xl shadow-lg"
          onClick={handleEnter}
        >
          ENTER
        </Button>
      </div>
    </div>
  )
}
