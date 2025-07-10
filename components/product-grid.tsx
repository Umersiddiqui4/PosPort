"use client"

import { Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { memo, useCallback } from "react"

interface Product {
  id: number
  name: string
  price: number
  image: string
  quantity?: number
}

interface ProductGridProps {
  products: Product[]
  onQuantityChange: (productId: number, quantity: number) => void
  onAddToCart: (productId: number) => void
  viewMode: "grid" | "list"
}

const ProductCard = memo(
  ({
    product,
    onQuantityChange,
    onAddToCart,
    viewMode,
  }: {
    product: Product
    onQuantityChange: (productId: number, quantity: number) => void
    onAddToCart: (productId: number) => void
    viewMode: "grid" | "list"
  }) => {
    const handleIncrement = useCallback(() => {
      onQuantityChange(product.id, (product.quantity || 0) + 1)
    }, [product.id, product.quantity, onQuantityChange])

    const handleDecrement = useCallback(() => {
      onQuantityChange(product.id, Math.max(0, (product.quantity || 0) - 1))
    }, [product.id, product.quantity, onQuantityChange])

    const handleAddToCart = useCallback(() => {
      onAddToCart(product.id)
    }, [product.id, onAddToCart])

    if (viewMode === "list") {
      return (
        <article className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-lg hover:border-[#1a72dd]/20 transition-all duration-300 group">
          <div className="flex gap-5">
            <div className="relative overflow-hidden rounded-xl">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-24 h-24 sm:w-28 sm:h-28 object-cover transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-[#2a3256] text-base sm:text-lg mb-2 group-hover:text-[#1a72dd] transition-colors">
                  {product.name}
                </h3>
                <p className="text-[#1a72dd] font-bold text-lg sm:text-xl">{product.price} PKR</p>
              </div>

              {product.quantity ? (
                <div className="flex items-center gap-3 sm:gap-4 mt-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleDecrement}
                    className="w-10 h-10 sm:w-12 sm:h-12 p-0 rounded-full border-2 border-[#1a72dd] text-[#1a72dd] hover:bg-[#1a72dd] hover:text-white transition-all duration-200 hover:scale-110 bg-transparent"
                    aria-label={`Decrease ${product.name} quantity`}
                  >
                    <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                  <span className="font-bold text-lg sm:text-xl min-w-[40px] text-center text-[#2a3256]">
                    {product.quantity}
                  </span>
                  <Button
                    size="sm"
                    onClick={handleIncrement}
                    className="w-10 h-10 sm:w-12 sm:h-12 p-0 rounded-full bg-[#1a72dd] hover:bg-[#1557b8] transition-all duration-200 hover:scale-110 shadow-lg"
                    aria-label={`Increase ${product.name} quantity`}
                  >
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleAddToCart}
                  className="bg-gradient-to-r from-[#1a72dd] to-[#1557b8] hover:from-[#1557b8] hover:to-[#1a72dd] rounded-full px-6 sm:px-8 py-2 sm:py-3 font-semibold mt-3 transition-all duration-200 hover:scale-105 shadow-lg text-sm sm:text-base"
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  ADD TO CART
                </Button>
              )}
            </div>
          </div>
        </article>
      )
    }

    return (
      <article className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 hover:shadow-xl hover:border-[#1a72dd]/20 transition-all duration-300 group hover:-translate-y-1">
        <div className="relative overflow-hidden rounded-xl mb-4">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-28 sm:h-32 md:h-36 object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-[#2a3256] text-sm sm:text-base mb-2 group-hover:text-[#1a72dd] transition-colors line-clamp-2 leading-tight">
            {product.name}
          </h3>
          <p className="text-[#1a72dd] font-bold text-base sm:text-lg">{product.price} PKR</p>

          {product.quantity ? (
            <div className="flex items-center justify-between pt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleDecrement}
                className="w-8 h-8 sm:w-10 sm:h-10 p-0 rounded-full border-2 border-[#1a72dd] text-[#1a72dd] hover:bg-[#1a72dd] hover:text-white transition-all duration-200 hover:scale-110 bg-transparent"
                aria-label={`Decrease ${product.name} quantity`}
              >
                <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
              <span className="font-bold text-sm sm:text-base text-[#2a3256] px-2">{product.quantity}</span>
              <Button
                size="sm"
                onClick={handleIncrement}
                className="w-8 h-8 sm:w-10 sm:h-10 p-0 rounded-full bg-[#1a72dd] hover:bg-[#1557b8] transition-all duration-200 hover:scale-110 shadow-lg"
                aria-label={`Increase ${product.name} quantity`}
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              onClick={handleAddToCart}
              className="w-full bg-gradient-to-r from-[#1a72dd] to-[#1557b8] hover:from-[#1557b8] hover:to-[#1a72dd] rounded-full font-semibold py-2 sm:py-3 transition-all duration-200 hover:scale-105 shadow-lg text-xs sm:text-sm"
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              ADD TO CART
            </Button>
          )}
        </div>
      </article>
    )
  },
)

ProductCard.displayName = "ProductCard"

export default function ProductGrid({ products, onQuantityChange, onAddToCart, viewMode }: ProductGridProps) {
  return (
    <section
      className={`${
        viewMode === "list"
          ? "space-y-4 p-4 sm:p-6 pt-6 sm:pt-8 pb-24 sm:pb-20"
          : "grid grid-cols-3 gap-4 sm:gap-5 md:gap-6 p-4 sm:p-6 pt-6 sm:pt-8 pb-24 sm:pb-20"
      }`}
      aria-label="Product catalog"
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onQuantityChange={onQuantityChange}
          onAddToCart={onAddToCart}
          viewMode={viewMode}
        />
      ))}
    </section>
  )
}
