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
        <article className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 hover:shadow-lg hover:border-[#1a72dd]/20 transition-all duration-300 group">
          <div className="flex gap-4 sm:gap-5">
            <div className="relative overflow-hidden rounded-xl">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 object-cover transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-[#2a3256] text-sm sm:text-base lg:text-lg mb-1 sm:mb-2 group-hover:text-[#1a72dd] transition-colors">
                  {product.name}
                </h3>
                <p className="text-[#1a72dd] font-bold text-base sm:text-lg lg:text-xl">{product.price} PKR</p>
              </div>

              {product.quantity ? (
                <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 mt-2 sm:mt-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleDecrement}
                    className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 p-0 rounded-full border-2 border-[#1a72dd] text-[#1a72dd] hover:bg-[#1a72dd] hover:text-white transition-all duration-200 hover:scale-110 bg-transparent"
                    aria-label={`Decrease ${product.name} quantity`}
                  >
                    <Minus className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                  </Button>
                  <span className="font-bold text-sm sm:text-base lg:text-lg min-w-[30px] sm:min-w-[35px] lg:min-w-[40px] text-center text-[#2a3256]">
                    {product.quantity}
                  </span>
                  <Button
                    size="sm"
                    onClick={handleIncrement}
                    className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 p-0 rounded-full bg-[#1a72dd] hover:bg-[#1557b8] transition-all duration-200 hover:scale-110 shadow-lg"
                    aria-label={`Increase ${product.name} quantity`}
                  >
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleAddToCart}
                  className="bg-gradient-to-r from-[#1a72dd] to-[#1557b8] hover:from-[#1557b8] hover:to-[#1a72dd] rounded-full px-4 sm:px-6 lg:px-8 py-2 sm:py-2 lg:py-3 font-semibold mt-2 sm:mt-3 transition-all duration-200 hover:scale-105 shadow-lg text-xs sm:text-sm lg:text-base"
                >
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 mr-1 sm:mr-2" />
                  ADD
                </Button>
              )}
            </div>
          </div>
        </article>
      )
    }

    return (
      <article className="bg-white rounded-2xl p-3 sm:p-4 lg:p-5 shadow-sm border border-gray-100 hover:shadow-xl hover:border-[#1a72dd]/20 transition-all duration-300 group hover:-translate-y-1">
        <div className="relative overflow-hidden rounded-xl mb-3 sm:mb-4">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-24 sm:h-28 md:h-32 lg:h-36 object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="space-y-2 sm:space-y-3">
          <h3 className="font-semibold text-[#2a3256] text-xs sm:text-sm lg:text-base mb-1 sm:mb-2 group-hover:text-[#1a72dd] transition-colors line-clamp-2 leading-tight">
            {product.name}
          </h3>
          <p className="text-[#1a72dd] font-bold text-sm sm:text-base lg:text-lg">{product.price} PKR</p>

          {product.quantity ? (
            <div className="flex items-center justify-between pt-1 sm:pt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleDecrement}
                className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 p-0 rounded-full border-2 border-[#1a72dd] text-[#1a72dd] hover:bg-[#1a72dd] hover:text-white transition-all duration-200 hover:scale-110 bg-transparent"
                aria-label={`Decrease ${product.name} quantity`}
              >
                <Minus className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4" />
              </Button>
              <span className="font-bold text-xs sm:text-sm lg:text-base text-[#2a3256] px-1 sm:px-2">
                {product.quantity}
              </span>
              <Button
                size="sm"
                onClick={handleIncrement}
                className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 p-0 rounded-full bg-[#1a72dd] hover:bg-[#1557b8] transition-all duration-200 hover:scale-110 shadow-lg"
                aria-label={`Increase ${product.name} quantity`}
              >
                <Plus className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4" />
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              onClick={handleAddToCart}
              className="w-full bg-gradient-to-r from-[#1a72dd] to-[#1557b8] hover:from-[#1557b8] hover:to-[#1a72dd] rounded-full font-semibold py-1.5 sm:py-2 lg:py-3 transition-all duration-200 hover:scale-105 shadow-lg text-xs sm:text-sm lg:text-base"
            >
              <Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-4 lg:h-4 mr-1 sm:mr-2" />
              ADD
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
          ? "space-y-3 sm:space-y-4 p-3 sm:p-4 lg:p-6 pt-4 sm:pt-6 lg:pt-8 pb-24 sm:pb-20"
          : "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5 xl:gap-6 p-3 sm:p-4 lg:p-6 pt-4 sm:pt-6 lg:pt-8 pb-24 sm:pb-20"
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
