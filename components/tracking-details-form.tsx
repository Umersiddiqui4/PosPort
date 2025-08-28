"use client"

import { useState, useEffect } from "react"
import { X, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useProductTrackingDetails } from "@/hooks/use-product-tracking-details"
import type { ProductTrackingDetails } from "@/lib/Api/productTrackingDetails"

interface TrackingDetailsFormProps {
  isOpen: boolean
  onClose: () => void
  productId: string
  trackingDetails?: ProductTrackingDetails | null
  mode: "create" | "edit"
}

export default function TrackingDetailsForm({
  isOpen,
  onClose,
  productId,
  trackingDetails,
  mode
}: TrackingDetailsFormProps) {
  const { createTrackingDetails, updateTrackingDetails } = useProductTrackingDetails(productId)
  
  const [formData, setFormData] = useState({
    barCode: "",
    sku: ""
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Populate form when editing
  useEffect(() => {
    if (trackingDetails && mode === "edit") {
      setFormData({
        barCode: trackingDetails.barCode || "",
        sku: trackingDetails.sku || ""
      })
    } else {
      setFormData({
        barCode: "",
        sku: ""
      })
    }
  }, [trackingDetails, mode, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (mode === "create") {
        await createTrackingDetails.mutateAsync({
          productId,
          barCode: formData.barCode,
          sku: formData.sku
        })
      } else if (mode === "edit" && trackingDetails) {
        await updateTrackingDetails.mutateAsync({
          id: trackingDetails.id,
          data: {
            barCode: formData.barCode,
            sku: formData.sku
          }
        })
      }
      
      onClose()
    } catch (error) {
      // Error handling is done in the mutation
      console.error("Form submission error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add Tracking Details" : "Edit Tracking Details"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="barCode">Barcode *</Label>
            <Input
              id="barCode"
              type="text"
              value={formData.barCode}
              onChange={(e) => setFormData({ ...formData, barCode: e.target.value })}
              placeholder="e.g., 1234567890123"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter the product barcode (numeric)
            </p>
          </div>

          <div>
            <Label htmlFor="sku">SKU *</Label>
            <Input
              id="sku"
              type="text"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              placeholder="e.g., PROD-001"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter the Stock Keeping Unit (SKU) code
            </p>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-[#1a72dd] hover:bg-[#1557b8]"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting 
                ? (mode === "create" ? "Creating..." : "Updating...") 
                : (mode === "create" ? "Create" : "Update")
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
