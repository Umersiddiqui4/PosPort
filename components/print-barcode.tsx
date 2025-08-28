"use client"

import { useRef } from "react"
import { Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import BarcodeDisplay from "./barcode-display"

interface PrintBarcodeProps {
  value: string
  productName?: string
  sku?: string
  className?: string
}

export default function PrintBarcode({ 
  value, 
  productName = "Product", 
  sku = "",
  className = "" 
}: PrintBarcodeProps) {
  const printRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    // Create a temporary SVG element to generate the barcode
    const tempSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    tempSvg.setAttribute("width", "400")
    tempSvg.setAttribute("height", "120")
    
    try {
      // Generate barcode in current window
      JsBarcode(tempSvg, value, {
        format: "CODE128",
        width: 2,
        height: 100,
        displayValue: false,
        margin: 10,
        background: "#ffffff",
        lineColor: "#000000"
      })
      
      // Get the SVG content
      const svgContent = tempSvg.outerHTML
      
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Barcode - ${productName}</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 20px;
                  text-align: center;
                }
                .barcode-container {
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  gap: 10px;
                  margin: 20px 0;
                }
                .product-info {
                  margin-bottom: 20px;
                }
                .product-name {
                  font-size: 18px;
                  font-weight: bold;
                  margin-bottom: 5px;
                }
                .sku {
                  font-size: 14px;
                  color: #666;
                }
                .barcode-value {
                  font-family: monospace;
                  font-size: 12px;
                  margin-top: 10px;
                }
                .barcode-svg {
                  border: 1px solid #ddd;
                  padding: 10px;
                  background: white;
                }
                @media print {
                  body { margin: 0; }
                  .no-print { display: none; }
                }
              </style>
            </head>
            <body>
              <div class="barcode-container">
                <div class="product-info">
                  <div class="product-name">${productName}</div>
                  ${sku ? `<div class="sku">SKU: ${sku}</div>` : ''}
                </div>
                <div class="barcode-svg">
                  ${svgContent}
                </div>
                <div class="barcode-value">${value}</div>
              </div>
              <script>
                window.onload = function() {
                  setTimeout(() => {
                    window.print();
                  }, 100);
                };
              </script>
            </body>
          </html>
        `)
        printWindow.document.close()
      }
    } catch (error) {
      console.error('Barcode generation error:', error)
      alert('Error generating barcode for printing. Please try again.')
    }
  }

  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`} ref={printRef}>
      <BarcodeDisplay 
        value={value} 
        width={2}
        height={80}
        fontSize={16}
        className="bg-white p-4 rounded-lg border"
      />
      <Button
        onClick={handlePrint}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
      >
        <Printer className="w-4 h-4" />
        Print Barcode
      </Button>
    </div>
  )
}
