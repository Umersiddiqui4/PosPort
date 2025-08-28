"use client"

import { useEffect, useRef } from "react"
import JsBarcode from "jsbarcode"

interface BarcodeDisplayProps {
  value: string
  width?: number
  height?: number
  fontSize?: number
  className?: string
}

export default function BarcodeDisplay({ 
  value, 
  width = 2, 
  height = 100, 
  fontSize = 20,
  className = "" 
}: BarcodeDisplayProps) {
  const barcodeRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (barcodeRef.current && value) {
      try {
        JsBarcode(barcodeRef.current, value, {
          format: "CODE128",
          width: width,
          height: height,
          displayValue: true,
          fontSize: fontSize,
          margin: 10,
          background: "#ffffff",
          lineColor: "#000000",
          textAlign: "center",
          textPosition: "bottom",
          textMargin: 5,
        })
      } catch (error) {
        console.error("Error generating barcode:", error)
      }
    }
  }, [value, width, height, fontSize])

  if (!value) {
    return (
      <div className={`flex items-center justify-center h-32 bg-gray-100 dark:bg-gray-800 rounded-lg ${className}`}>
        <span className="text-gray-500 dark:text-gray-400">No barcode available</span>
      </div>
    )
  }

  return (
    <div className={`flex flex-col items-center space-y-2 ${className}`}>
      <svg ref={barcodeRef} className="max-w-full" />
      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-300 font-mono">{value}</p>
      </div>
    </div>
  )
}
