"use client"

import { useState } from "react"
// @ts-ignore
import QRCode from "react-qr-code"
import { QrCode, Download, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

interface QRCodeDisplayProps {
  value: string
  locationName: string
  size?: number
  showDialog?: boolean
}

export default function QRCodeDisplay({ 
  value, 
  locationName, 
  size = 128,
  showDialog = true 
}: QRCodeDisplayProps) {
  const [isCopied, setIsCopied] = useState(false)
  const { toast } = useToast()

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setIsCopied(true)
      toast({
        title: "QR Code copied!",
        description: "The QR code value has been copied to your clipboard.",
      })
      setTimeout(() => setIsCopied(false), 2000)
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy QR code to clipboard.",
        variant: "destructive",
      })
    }
  }

  const handleDownload = () => {
    const svg = document.querySelector(`#qr-${value.replace(/[^a-zA-Z0-9]/g, '')}`) as SVGElement
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg)
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      const img = new Image()
      
      img.onload = () => {
        canvas.width = size
        canvas.height = size
        ctx?.drawImage(img, 0, 0)
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob)
            const link = document.createElement("a")
            link.download = `${locationName}-qr-code.png`
            link.href = url
            link.click()
            URL.revokeObjectURL(url)
          }
        })
      }
      
      img.src = `data:image/svg+xml;base64,${btoa(svgData)}`
    }
  }

  const QRCodeComponent = () => (
    <div className="flex flex-col items-center space-y-4 p-4 bg-white rounded-lg">
      <div className="text-center">
        <h3 className="font-semibold text-gray-900 mb-2">{locationName}</h3>
        <p className="text-sm text-gray-600 mb-4">QR Code</p>
      </div>
      
      <div className="bg-white p-8 rounded-lg border">
        <QRCode
          id={`qr-${value.replace(/[^a-zA-Z0-9]/g, '')}`}
          value={value}
          size={size}
          level="M"
        />
      </div>
      
      <div className="text-xs text-gray-500 font-mono break-all max-w-xs text-center">
        {value}
      </div>
      
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="flex items-center gap-2"
        >
          {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {isCopied ? "Copied!" : "Copy"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownload}
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download
        </Button>
      </div>
    </div>
  )

  if (!showDialog) {
    return <QRCodeComponent />
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <QrCode className="w-4 h-4" />
          View QR
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>QR Code - {locationName}</DialogTitle>
          <DialogDescription>
            Scan this QR code to access location information
          </DialogDescription>
        </DialogHeader>
        <QRCodeComponent />
      </DialogContent>
    </Dialog>
  )
} 