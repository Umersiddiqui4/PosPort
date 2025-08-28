"use client"

import { useState, useEffect } from "react"
import { X, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useProductLifetimeDetails } from "@/hooks/use-product-lifetime-details"
import type { ProductLifetimeDetails } from "@/lib/Api/productLifetimeDetails"

interface LifetimeDetailsFormProps {
  isOpen: boolean
  onClose: () => void
  productId: string
  lifetimeDetails?: ProductLifetimeDetails | null
  mode: "create" | "edit"
}

export default function LifetimeDetailsForm({
  isOpen,
  onClose,
  productId,
  lifetimeDetails,
  mode
}: LifetimeDetailsFormProps) {
  const { createLifetimeDetails, updateLifetimeDetails } = useProductLifetimeDetails(productId)
  
  const [formData, setFormData] = useState({
    expiry: "",
    shelfLife: ""
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Populate form when editing
  useEffect(() => {
    if (lifetimeDetails && mode === "edit") {
      setFormData({
        expiry: lifetimeDetails.expiry ? new Date(lifetimeDetails.expiry).toISOString().split('T')[0] : "",
        shelfLife: lifetimeDetails.shelfLife || ""
      })
    } else {
      setFormData({
        expiry: "",
        shelfLife: ""
      })
    }
  }, [lifetimeDetails, mode, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (mode === "create") {
        await createLifetimeDetails.mutateAsync({
          productId,
          expiry: formData.expiry,
          shelfLife: formData.shelfLife
        })
      } else if (mode === "edit" && lifetimeDetails) {
        await updateLifetimeDetails.mutateAsync({
          id: lifetimeDetails.id,
          data: {
            expiry: formData.expiry,
            shelfLife: formData.shelfLife
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
            {mode === "create" ? "Add Lifetime Details" : "Edit Lifetime Details"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="expiry">Expiry Date *</Label>
            <Input
              id="expiry"
              type="date"
              value={formData.expiry}
              onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
              required
              min={new Date().toISOString().split('T')[0]} // Can't set expiry in the past
            />
            <p className="text-xs text-gray-500 mt-1">
              Select the expiry date for this product
            </p>
          </div>

          <div>
            <Label htmlFor="shelfLife">Shelf Life *</Label>
            <Input
              id="shelfLife"
              value={formData.shelfLife}
              onChange={(e) => setFormData({ ...formData, shelfLife: e.target.value })}
              placeholder="e.g., 12 months, 6 weeks, 2 years"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter the shelf life duration (e.g., "12 months", "6 weeks")
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
