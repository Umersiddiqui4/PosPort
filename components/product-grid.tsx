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
        <article className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-lg hover:border-[#1a72dd]/20 transition-all duration-300 group">
          <div className="flex gap-4">
            <div className="relative overflow-hidden rounded-xl">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-24 h-24 object-cover transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-[#2a3256] text-lg mb-1 group-hover:text-[#1a72dd] transition-colors">
                  {product.name}
                </h3>
                <p className="text-[#1a72dd] font-bold text-xl">{product.price} PKR</p>
              </div>

              {product.quantity ? (
                <div className="flex items-center gap-3 mt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleDecrement}
                    className="w-10 h-10 p-0 rounded-full border-2 border-[#1a72dd] text-[#1a72dd] hover:bg-[#1a72dd] hover:text-white transition-all duration-200 hover:scale-110 bg-transparent"
                    aria-label={`Decrease ${product.name} quantity`}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="font-bold text-lg min-w-[30px] text-center text-[#2a3256]">{product.quantity}</span>
                  <Button
                    size="sm"
                    onClick={handleIncrement}
                    className="w-10 h-10 p-0 rounded-full bg-[#1a72dd] hover:bg-[#1557b8] transition-all duration-200 hover:scale-110 shadow-lg"
                    aria-label={`Increase ${product.name} quantity`}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleAddToCart}
                  className="bg-gradient-to-r from-[#1a72dd] to-[#1557b8] hover:from-[#1557b8] hover:to-[#1a72dd] rounded-full px-6 font-semibold mt-2 transition-all duration-200 hover:scale-105 shadow-lg"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  ADD TO CART
                </Button>
              )}
            </div>
          </div>
        </article>
      )
    }

    return (
      <article className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-xl hover:border-[#1a72dd]/20 transition-all duration-300 group hover:-translate-y-1">
        <div className="relative overflow-hidden rounded-xl mb-3">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-36 object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <h3 className="font-semibold text-[#2a3256] text-base mb-1 group-hover:text-[#1a72dd] transition-colors line-clamp-2">
          {product.name}
        </h3>
        <p className="text-[#1a72dd] font-bold text-lg mb-3">{product.price} PKR</p>

        {product.quantity ? (
          <div className="flex items-center justify-between">
            <Button
              size="sm"
              variant="outline"
              onClick={handleDecrement}
              className="w-9 h-9 p-0 rounded-full border-2 border-[#1a72dd] text-[#1a72dd] hover:bg-[#1a72dd] hover:text-white transition-all duration-200 hover:scale-110 bg-transparent"
              aria-label={`Decrease ${product.name} quantity`}
            >
              <Minus className="w-3 h-3" />
            </Button>
            <span className="font-bold text-[#2a3256]">{product.quantity}</span>
            <Button
              size="sm"
              onClick={handleIncrement}
              className="w-9 h-9 p-0 rounded-full bg-[#1a72dd] hover:bg-[#1557b8] transition-all duration-200 hover:scale-110 shadow-lg"
              aria-label={`Increase ${product.name} quantity`}
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>
        ) : (
          <Button
            size="sm"
            onClick={handleAddToCart}
            className="w-full bg-gradient-to-r from-[#1a72dd] to-[#1557b8] hover:from-[#1557b8] hover:to-[#1a72dd] rounded-full font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
          >
            <Plus className="w-3 h-3 mr-1" />
            ADD
          </Button>
        )}
      </article>
    )
  },
)

ProductCard.displayName = "ProductCard"

export default function ProductGrid({ products, onQuantityChange, onAddToCart, viewMode }: ProductGridProps) {
  return (
    <section
      className={`${viewMode === "list" ? "space-y-3 p-4 pt-6 pb-20" : "grid grid-cols-2 gap-4 p-4 pt-6 pb-20"}`}
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
