"use client"

import { useState, useEffect } from "react"
import { X, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useProductInventory } from "@/hooks/use-product-inventory"
import type { ProductInventory } from "@/lib/Api/productInventory"

interface InventoryFormProps {
  isOpen: boolean
  onClose: () => void
  productId: string
  inventory?: ProductInventory | null
  mode: "create" | "edit"
}

export default function InventoryForm({
  isOpen,
  onClose,
  productId,
  inventory,
  mode
}: InventoryFormProps) {
  const { createInventory, updateInventory } = useProductInventory(productId)
  
  const [formData, setFormData] = useState({
    currentStock: 0,
    reservedStock: 0,
    reorderLevel: 0,
    minimumReorderQuantity: 0,
    maxStockCapacity: 0,
    costPerUnit: 0
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Populate form when editing
  useEffect(() => {
    if (inventory && mode === "edit") {
      setFormData({
        currentStock: inventory.currentStock || 0,
        reservedStock: inventory.reservedStock || 0,
        reorderLevel: inventory.reorderLevel || 0,
        minimumReorderQuantity: inventory.minimumReorderQuantity || 0,
        maxStockCapacity: inventory.maxStockCapacity || 0,
        costPerUnit: inventory.costPerUnit || 0
      })
    } else {
      setFormData({
        currentStock: 0,
        reservedStock: 0,
        reorderLevel: 0,
        minimumReorderQuantity: 0,
        maxStockCapacity: 0,
        costPerUnit: 0
      })
    }
  }, [inventory, mode, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (mode === "create") {
        await createInventory.mutateAsync({
          productId,
          ...formData
        })
      } else if (mode === "edit" && inventory) {
        await updateInventory.mutateAsync({
          id: inventory.id,
          data: formData
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
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add Inventory" : "Edit Inventory"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="currentStock">Current Stock *</Label>
              <Input
                id="currentStock"
                type="number"
                min="0"
                value={formData.currentStock}
                onChange={(e) => setFormData({ ...formData, currentStock: parseInt(e.target.value) || 0 })}
                required
              />
            </div>

            <div>
              <Label htmlFor="reservedStock">Reserved Stock *</Label>
              <Input
                id="reservedStock"
                type="number"
                min="0"
                value={formData.reservedStock}
                onChange={(e) => setFormData({ ...formData, reservedStock: parseInt(e.target.value) || 0 })}
                required
              />
            </div>

            <div>
              <Label htmlFor="reorderLevel">Reorder Level *</Label>
              <Input
                id="reorderLevel"
                type="number"
                min="0"
                value={formData.reorderLevel}
                onChange={(e) => setFormData({ ...formData, reorderLevel: parseInt(e.target.value) || 0 })}
                required
              />
            </div>

            <div>
              <Label htmlFor="minimumReorderQuantity">Min Reorder Quantity *</Label>
              <Input
                id="minimumReorderQuantity"
                type="number"
                min="0"
                value={formData.minimumReorderQuantity}
                onChange={(e) => setFormData({ ...formData, minimumReorderQuantity: parseInt(e.target.value) || 0 })}
                required
              />
            </div>

            <div>
              <Label htmlFor="maxStockCapacity">Max Stock Capacity *</Label>
              <Input
                id="maxStockCapacity"
                type="number"
                min="0"
                value={formData.maxStockCapacity}
                onChange={(e) => setFormData({ ...formData, maxStockCapacity: parseInt(e.target.value) || 0 })}
                required
              />
            </div>

            <div>
              <Label htmlFor="costPerUnit">Cost Per Unit (PKR) *</Label>
              <Input
                id="costPerUnit"
                type="number"
                min="0"
                step="0.01"
                value={formData.costPerUnit}
                onChange={(e) => setFormData({ ...formData, costPerUnit: parseFloat(e.target.value) || 0 })}
                required
              />
            </div>
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
