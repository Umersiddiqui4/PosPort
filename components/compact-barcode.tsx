"use client"

import { useEffect, useRef } from "react"
import JsBarcode from "jsbarcode"

interface CompactBarcodeProps {
  value: string
  width?: number
  height?: number
  fontSize?: number
  className?: string
  showText?: boolean
}

export default function CompactBarcode({ 
  value, 
  width = 1.5, 
  height = 40, 
  fontSize = 12,
  className = "",
  showText = false
}: CompactBarcodeProps) {
  const barcodeRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (barcodeRef.current && value) {
      try {
        JsBarcode(barcodeRef.current, value, {
          format: "CODE128",
          width: width,
          height: height,
          displayValue: showText,
          fontSize: fontSize,
          margin: 5,
          background: "#ffffff",
          lineColor: "#000000",
          textAlign: "center",
          textPosition: "bottom",
          textMargin: 2,
        })
      } catch (error) {
        console.error("Error generating barcode:", error)
      }
    }
  }, [value, width, height, fontSize, showText])

  if (!value) {
    return null
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <svg ref={barcodeRef} className="max-w-full" />
      {showText && (
        <p className="text-xs text-gray-600 dark:text-gray-300 font-mono mt-1 truncate max-w-full">
          {value}
        </p>
      )}
    </div>
  )
}
