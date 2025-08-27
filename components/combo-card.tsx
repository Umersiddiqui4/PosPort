import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Plus, Tag, Package, MoreVertical, Edit, Trash2 } from 'lucide-react'
import { Combo } from '@/hooks/use-combos'

interface ComboCardProps {
  combo: Combo
  onAddToCart: (combo: Combo) => void
  isInCart?: boolean
  onEdit?: (combo: Combo) => void
  onDelete?: (comboId: string) => void
  isDeleting?: boolean
}

export default function ComboCard({ combo, onAddToCart, isInCart = false, onEdit, onDelete, isDeleting = false }: ComboCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const getFirstProductImage = () => {
    for (const item of combo.comboItems) {
      if (item.product.attachments && item.product.attachments.length > 0) {
        return item.product.attachments[0].url
      }
    }
    return '/placeholder.svg'
  }

  const getProductNames = () => {
    return combo.comboItems.map(item => {
      const quantity = item.quantity || 1
      return quantity > 1 ? `${item.product.productName} (${quantity})` : item.product.productName
    }).join(', ')
  }

  const handleCardClick = () => {
    setIsModalOpen(true)
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    onEdit?.(combo)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    onDelete?.(combo.id)
    setIsDeleteDialogOpen(false)
  }

  return (
    <>
      <Card 
        className="w-64 sm:w-72 md:w-80 h-auto min-h-[320px] sm:min-h-[384px] flex-shrink-0 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-[#1a72dd] dark:hover:border-blue-400 transition-all duration-200 shadow-lg hover:shadow-xl flex flex-col cursor-pointer"
        onClick={handleCardClick}
      >
        {/* Image - Always at the top */}
        <div className="relative w-full h-32 sm:h-36 md:h-40 rounded-t-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
          <img
            src={getFirstProductImage()}
            alt={combo.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = '/placeholder.svg'
            }}
          />
          <div className="absolute top-2 left-2">
                          <Badge variant="secondary" className="bg-white/90 text-gray-800 text-xs">
                <Package className="w-3 h-3 mr-1" />
                {combo.comboItems.reduce((total, item) => total + (item.quantity || 1), 0)} items
              </Badge>
          </div>

          
          {/* Dropdown Menu */}
          <div className="absolute top-2 right-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 bg-white/90 hover:bg-white text-gray-700 rounded-full"
                >
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                <DropdownMenuItem onClick={handleEdit} className="cursor-pointer">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleDelete} 
                  className="cursor-pointer text-red-600"
                  disabled={isDeleting}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Content - Middle section */}
        <div className="flex-1 flex flex-col p-4 sm:p-5">
          {/* Title and Description */}
          <div className="mb-3 sm:mb-4">
            <h3 className="text-base sm:text-lg font-bold text-gray-800 dark:text-gray-200 line-clamp-2 mb-2">
              {combo.name}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
              {combo.description}
            </p>
          </div>

          {/* Products included */}
          <div className="flex-1 mb-3 sm:mb-4">
            <h4 className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 sm:mb-2 flex items-center">
              <Package className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              Includes:
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 sm:line-clamp-3">
              {getProductNames()}
            </p>
          </div>

          {/* Pricing - Always at bottom, above button */}
          <div className="mb-3 sm:mb-4">
            <div className="flex items-center justify-between flex-wrap gap-1">
              <span className="text-base sm:text-lg font-bold text-[#1a72dd] dark:text-blue-400 flex-shrink-0">
                ${combo.bundlePrice}
              </span>
              {combo.shouldShowSeparatePrice && (
                <span className="text-xs sm:text-sm text-gray-500 line-through flex-shrink-0">
                  ${combo.separatePrice}
                </span>
              )}
              {combo.shouldShowSeparatePrice && (
                <div className="flex items-center text-xs text-green-600 dark:text-green-400 flex-shrink-0">
                  <Tag className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />
                  Save ${(combo.separatePrice - combo.bundlePrice).toFixed(2)}
                </div>
              )}
            </div>
          </div>

          {/* Add to cart button - Always at the bottom */}
          <Button
            onClick={(e) => {
              e.stopPropagation()
              onAddToCart(combo)
            }}
            disabled={isInCart}
            className={`w-full text-xs sm:text-sm py-2 sm:py-3 ${
              isInCart 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-[#1a72dd] hover:bg-[#1557b8] text-white'
            } transition-all duration-200`}
          >
            <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            {isInCart ? 'Added to Cart' : 'Add to Cart'}
          </Button>
        </div>
      </Card>

      {/* Combo Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-800 dark:text-gray-200">
              {combo.name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Combo Image */}
            <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
              <img
                src={getFirstProductImage()}
                alt={combo.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = '/placeholder.svg'
                }}
              />
              <div className="absolute top-3 left-3">
                              <Badge variant="secondary" className="bg-white/90 text-gray-800">
                <Package className="w-4 h-4 mr-1" />
                {combo.comboItems.reduce((total, item) => total + (item.quantity || 1), 0)} items
              </Badge>
              </div>
              
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Description</h3>
              <p className="text-gray-600 dark:text-gray-300">{combo.description}</p>
            </div>

            {/* Combo Items */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Included Items
              </h3>
              <div className="grid gap-4">
                {combo.comboItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                      <img
                        src={item.product.attachments?.[0]?.url || '/placeholder.svg'}
                        alt={item.product.productName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = '/placeholder.svg'
                        }}
                      />
                    </div>
                                         <div className="flex-1 min-w-0">
                       <h4 className="font-semibold text-gray-800 dark:text-gray-200 truncate">
                         {item.product.productName}
                         {item.quantity > 1 && (
                           <span className="ml-2 text-sm text-gray-500">× {item.quantity}</span>
                         )}
                       </h4>
                       <p className="text-sm text-gray-600 dark:text-gray-400">
                         Price: ${item.product.retailPrice || 0}
                         {item.quantity > 1 && (
                           <span className="ml-1">× {item.quantity} = ${(item.product.retailPrice * item.quantity).toFixed(2)}</span>
                         )}
                       </p>
                     </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Pricing</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Bundle Price:</span>
                  <span className="text-xl font-bold text-[#1a72dd] dark:text-blue-400">
                    ${combo.bundlePrice}
                  </span>
                </div>
                {combo.shouldShowSeparatePrice && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Separate Price:</span>
                      <span className="text-lg text-gray-500 line-through">
                        ${combo.separatePrice}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-green-600 dark:text-green-400 font-semibold">You Save:</span>
                      <span className="text-lg font-bold text-green-600 dark:text-green-400">
                        ${(combo.separatePrice - combo.bundlePrice).toFixed(2)}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => {
                  onAddToCart(combo)
                  setIsModalOpen(false)
                }}
                disabled={isInCart}
                className={`flex-1 ${
                  isInCart 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-[#1a72dd] hover:bg-[#1557b8] text-white'
                }`}
              >
                <Plus className="w-4 h-4 mr-2" />
                {isInCart ? 'Added to Cart' : 'Add to Cart'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="flex-1"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Combo</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{combo.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

