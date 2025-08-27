import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, Package, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useCombos, Combo } from '@/hooks/use-combos'
import { useComboOperations } from '@/hooks/use-combo-operations'
import ComboCard from './combo-card'
import ComboForm from './combo-form'
import { EditComboForm } from './edit-combo-form'

interface ComboSectionProps {
  onAddComboToCart: (combo: Combo) => void
  combosInCart: string[]
  onEditCombo?: (combo: Combo) => void
  onDeleteCombo?: (comboId: string) => void
  locationId?: string
}

export default function ComboSection({ onAddComboToCart, combosInCart, onEditCombo, onDeleteCombo, locationId }: ComboSectionProps) {
  const { combos, isLoading, error } = useCombos(1, 10, locationId)
  const { deleteCombo, isDeleting } = useComboOperations()
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingCombo, setEditingCombo] = useState<Combo | null>(null)

  const handleEditCombo = (combo: Combo) => {
    setEditingCombo(combo)
    setIsEditDialogOpen(true)
  }

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false)
    setEditingCombo(null)
  }

  const handleEditCancel = () => {
    setIsEditDialogOpen(false)
    setEditingCombo(null)
  }

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = window.innerWidth < 640 ? -280 : -400
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = window.innerWidth < 640 ? 280 : 400
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 border border-gray-200 dark:border-gray-700 mx-4 sm:mx-6">
        <div className="flex items-center justify-center h-24 sm:h-32">
          <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-[#1a72dd]"></div>
          <span className="ml-2 sm:ml-3 text-sm sm:text-base text-gray-600 dark:text-gray-300">Loading combos...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 border border-gray-200 dark:border-gray-700 mx-4 sm:mx-6">
        <div className="text-center text-red-600 dark:text-red-400">
          <Package className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2" />
          <p className="text-sm sm:text-base">Failed to load combos: {error}</p>
        </div>
      </div>
    )
  }

  if (combos.length === 0) {
    return null
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-800 mt-2 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 border border-gray-200 dark:border-gray-700 overflow-hidden mx-4 sm:mx-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <Package className="w-5 h-5 sm:w-6 sm:h-6 text-[#1a72dd] dark:text-blue-400" />
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-200">
            Special Combos
          </h2>
          <span className="bg-[#1a72dd] text-white text-xs sm:text-sm px-2 py-1 rounded-full">
            {combos.length}
          </span>
        </div>
        
        {/* Scroll Controls and Create Button */}
        <div className="hidden sm:flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={scrollLeft}
            className="w-8 h-8 border-gray-300 hover:border-[#1a72dd] hover:text-[#1a72dd]"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={scrollRight}
            className="w-8 h-8 border-gray-300 hover:border-[#1a72dd] hover:text-[#1a72dd]"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-[#1a72dd] hover:bg-[#1557b8] text-white px-3 py-1 text-sm"
          >
            <Plus className="w-4 h-4 mr-1" />
            Create Combo
          </Button>
        </div>
      </div>

      {/* Horizontal Scrollable Combo Cards */}
      <div className="relative w-full ">
        <div
          ref={scrollContainerRef}
          className="flex gap-3 sm:gap-4 px-4 md:gap-6 overflow-x-auto scrollbar-hide pb-2 sm:pb-4 w-full"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {combos.map((combo) => (
            <ComboCard
              key={combo.id}
              combo={combo}
              onAddToCart={onAddComboToCart}
              isInCart={combosInCart.includes(combo.id)}
              onEdit={handleEditCombo}
              onDelete={deleteCombo}
              isDeleting={isDeleting}
            />
          ))}
        </div>
        
        {/* Gradient overlays for better UX - Hidden on mobile */}
        <div className="hidden sm:block absolute left-0 top-0 bottom-2 sm:bottom-4 w-8 bg-gradient-to-r from-white dark:from-gray-800 to-transparent pointer-events-none z-10" />
        <div className="hidden sm:block absolute right-0 top-0 bottom-2 sm:bottom-4 w-8 bg-gradient-to-l from-white dark:from-gray-800 to-transparent pointer-events-none z-10" />
      </div>
      </div>

    {/* Create Combo Dialog */}
    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Combo</DialogTitle>
        </DialogHeader>
        <ComboForm
          onSuccess={() => {
            setIsCreateDialogOpen(false)
          }}
          onCancel={() => setIsCreateDialogOpen(false)}
        />
      </DialogContent>
    </Dialog>

    {/* Edit Combo Dialog */}
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Combo</DialogTitle>
        </DialogHeader>
        {editingCombo && (
          <EditComboForm
            combo={editingCombo}
            onSuccess={handleEditSuccess}
            onCancel={handleEditCancel}
          />
        )}
      </DialogContent>
    </Dialog>
  </>
  )
}

