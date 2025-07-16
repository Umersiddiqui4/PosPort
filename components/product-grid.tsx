"use client"

import { Plus, Minus, ShoppingCart, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { memo, useCallback, useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion";

interface Product {
  id: number
  name: string
  price: number
  image: string
  quantity?: number
}

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
}

interface ProductGridProps {
  products: Product[]
  cartItems: CartItem[]
  onQuantityChange: (productId: number, quantity: number) => void
  onAddToCart: (productId: number) => void
  onRemoveFromCart: (productId: number) => void
  onProceedToPayment: () => void
  viewMode: "grid" | "list"
  isSidebarCollapsed?: boolean
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
        <article className="bg-white rounded-2xl p-3 sm:p-4 lg:p-5 shadow-sm border border-gray-100 hover:shadow-lg hover:border-[#1a72dd]/20 transition-all duration-300 group">
          <div className="flex gap-3 sm:gap-4 lg:gap-5">
            <div className="relative overflow-hidden rounded-xl flex-shrink-0">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 object-cover transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="flex-1 flex flex-col justify-between min-w-0">
              <div>
                <h3 className="font-semibold text-[#2a3256] text-sm sm:text-base lg:text-lg mb-1 group-hover:text-[#1a72dd] transition-colors truncate">
                  {product.name}
                </h3>
                <p className="text-[#1a72dd] font-bold text-sm sm:text-base lg:text-lg">{product.price} PKR</p>
              </div>

              {product.quantity ? (
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleDecrement}
                    className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 p-0 rounded-full border-2 border-[#1a72dd] text-[#1a72dd] hover:bg-[#1a72dd] hover:text-white transition-all duration-200 hover:scale-110 bg-transparent"
                    aria-label={`Decrease ${product.name} quantity`}
                  >
                    <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                  <span className="font-bold text-sm sm:text-base lg:text-lg min-w-[24px] sm:min-w-[30px] text-center text-[#2a3256]">
                    {product.quantity}
                  </span>
                  <Button
                    size="sm"
                    onClick={handleIncrement}
                    className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 p-0 rounded-full bg-[#1a72dd] hover:bg-[#1557b8] transition-all duration-200 hover:scale-110 shadow-lg"
                    aria-label={`Increase ${product.name} quantity`}
                  >
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleAddToCart}
                  className="bg-gradient-to-r from-[#1a72dd] to-[#1557b8] hover:from-[#1557b8] hover:to-[#1a72dd] rounded-full px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 font-semibold mt-2 transition-all duration-200 hover:scale-105 shadow-lg text-xs sm:text-sm lg:text-base w-fit"
                >
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  ADD
                </Button>
              )}
            </div>
          </div>
        </article>
      )
    }

    return (
      <article className="bg-white rounded-2xl p-2 sm:p-3 lg:p-4 shadow-sm border border-gray-100 hover:shadow-xl hover:border-[#1a72dd]/20 transition-all duration-300 group hover:-translate-y-1">
        <div className="relative overflow-hidden rounded-xl mb-2 sm:mb-3">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-20 sm:h-24 md:h-28 lg:h-32 xl:h-36 object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="space-y-1.5 sm:space-y-2">
          <h3 className="font-semibold text-[#2a3256] text-xs sm:text-sm lg:text-base mb-1 group-hover:text-[#1a72dd] transition-colors line-clamp-2 leading-tight">
            {product.name}
          </h3>
          <p className="text-[#1a72dd] font-bold text-xs sm:text-sm lg:text-base">{product.price} PKR</p>

          {product.quantity ? (
            <div className="flex items-center justify-between pt-1">
              <Button
                size="sm"
                variant="outline"
                onClick={handleDecrement}
                className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 p-0 rounded-full border-2 border-[#1a72dd] text-[#1a72dd] hover:bg-[#1a72dd] hover:text-white transition-all duration-200 hover:scale-110 bg-transparent"
                aria-label={`Decrease ${product.name} quantity`}
              >
                <Minus className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-3.5 lg:h-3.5" />
              </Button>
              <span className="font-bold text-xs sm:text-sm lg:text-base text-[#2a3256] px-1">{product.quantity}</span>
              <Button
                size="sm"
                onClick={handleIncrement}
                className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 p-0 rounded-full bg-[#1a72dd] hover:bg-[#1557b8] transition-all duration-200 hover:scale-110 shadow-lg"
                aria-label={`Increase ${product.name} quantity`}
              >
                <Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-3.5 lg:h-3.5" />
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              onClick={handleAddToCart}
              className="w-full bg-gradient-to-r from-[#1a72dd] to-[#1557b8] hover:from-[#1557b8] hover:to-[#1a72dd] rounded-full font-semibold py-1.5 sm:py-2 transition-all duration-200 hover:scale-105 shadow-lg text-xs sm:text-sm"
            >
              <Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />
              ADD
            </Button>
          )}
        </div>
      </article>
    )
  },
)

ProductCard.displayName = "ProductCard"

const CartItemCard = memo(
  ({
    item,
    onQuantityChange,
    onRemove,
    isCompact = false,
  }: {
    item: CartItem
    onQuantityChange: (productId: number, quantity: number) => void
    onRemove: (productId: number) => void
    isCompact?: boolean
  }) => {
    const handleIncrement = useCallback(() => {
      onQuantityChange(item.id, item.quantity + 1)
    }, [item.id, item.quantity, onQuantityChange])

    const handleDecrement = useCallback(() => {
      if (item.quantity > 1) {
        onQuantityChange(item.id, item.quantity - 1)
      } else {
        onRemove(item.id)
      }
    }, [item.id, item.quantity, onQuantityChange, onRemove])

    const handleRemove = useCallback(() => {
      onRemove(item.id)
    }, [item.id, onRemove])

    if (isCompact) {
      return (
        <div className="bg-white rounded-xl p-3 border border-gray-100 hover:border-[#1a72dd]/30 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-[#2a3256] text-sm truncate">{item.name}</h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-[#545454]">
                  {item.price} PKR × {item.quantity}
                </span>
                <span className="text-xs font-semibold text-[#1a72dd]">{item.price * item.quantity} PKR</span>
              </div>
            </div>

            <div className="flex items-center gap-2 ml-3">
              <Button
                size="sm"
                variant="outline"
                onClick={handleDecrement}
                className="w-6 h-6 p-0 rounded-full border border-[#1a72dd]/30 text-[#1a72dd] hover:bg-[#1a72dd] hover:text-white transition-all duration-200 bg-transparent"
              >
                <Minus className="w-2.5 h-2.5" />
              </Button>
              <span className="font-bold text-sm text-[#2a3256] min-w-[20px] text-center">{item.quantity}</span>
              <Button
                size="sm"
                onClick={handleIncrement}
                className="w-6 h-6 p-0 rounded-full bg-[#1a72dd] hover:bg-[#1557b8] transition-all duration-200 shadow-sm"
              >
                <Plus className="w-2.5 h-2.5" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleRemove}
                className="w-6 h-6 p-0 rounded-full border border-red-200 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200 bg-transparent ml-1"
              >
                <X className="w-2.5 h-2.5" />
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50 rounded-2xl p-4 border border-[#1a72dd]/10 hover:border-[#1a72dd]/30 transition-all duration-300 group hover:shadow-lg hover:-translate-y-1 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#1a72dd]/5 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-[#1557b8]/5 to-transparent rounded-full translate-y-8 -translate-x-8"></div>

        <div className="flex items-center justify-between relative z-10">
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gradient-to-br from-[#1a72dd] to-[#1557b8] rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                <ShoppingCart className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1  min-w-0">
                <h4 className="font-bold text-[#2a3256] text-sm sm:text-base group-hover:text-[#1a72dd] transition-colors duration-300 truncate">
                  {item.name}
                </h4>
                <div className="flex flex-col gap-1 mt-1">
                  <span className="text-xs text-[#545454] bg-gray-100 px-2 py-1 rounded-full w-fit">
                    {item.price} PKR each
                  </span>
                  <br />
                  {/* <span className="text-xs text-white bg-gradient-to-r from-[#1a72dd] to-[#1557b8] px-2 py-1 rounded-full font-semibold shadow-sm w-fit">
                  Total: {item.price * item.quantity} PKR
                </span> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center w-full gap-3 ml-3">
          <div className="flex items-center justify-between  w-3/4 gap-2 bg-white/80 backdrop-blur-sm rounded-xl p-2 shadow-sm border border-gray-100">
            <Button
              size="sm"
              variant="outline"
              onClick={handleDecrement}
              className="w-8 h-8 p-0 rounded-full border-2 border-[#1a72dd]/30 text-[#1a72dd] hover:bg-[#1a72dd] hover:text-white hover:border-[#1a72dd] transition-all duration-200 hover:scale-110 bg-white shadow-sm"
            >
              <Minus className="w-3 h-3" />
            </Button>
            <div className="flex flex-col items-center min-w-[40px]">
              <span className="font-bold text-[#2a3256] text-lg leading-none">{item.quantity}</span>
              <span className="text-xs text-[#545454] leading-none">qty</span>
            </div>
            <Button
              size="sm"
              onClick={handleIncrement}
              className="w-8 h-8 p-0 rounded-full bg-gradient-to-br from-[#1a72dd] to-[#1557b8] hover:from-[#1557b8] hover:to-[#1a72dd] transition-all duration-200 hover:scale-110 shadow-lg"
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={handleRemove}
            className="w-10 h-10 p-0 rounded-full border-2 border-red-200 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-200 hover:scale-110 bg-white shadow-sm group/remove"
          >
            <X className="w-4 h-4 group-hover/remove:rotate-90 transition-transform duration-200" />
          </Button>
        </div>
      </div>
    )
  },
)

CartItemCard.displayName = "CartItemCard"

export default function ProductGrid({
  products,
  cartItems,
  onQuantityChange,
  onAddToCart,
  onRemoveFromCart,
  onProceedToPayment,
  viewMode,
  isSidebarCollapsed = false,
}: ProductGridProps) {
  const [showMobileCart, setShowMobileCart] = useState(false)
  const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  
 const [isMobile, setIsMobile] = useState(false);


useEffect(() => {
  const handleResize = () => {
    setIsMobile(window.innerWidth < 1024);
  };

  handleResize(); // run on mount
  window.addEventListener("resize", handleResize);

  return () => window.removeEventListener("resize", handleResize);
}, []);
  console.log(isMobile, "isMobile"); 
  
  const getGridColumns = () => {
    if (viewMode === "list") return ""

    // Responsive grid based on screen size and sidebar state
    if (cartItems.length > 0) {
      // When cart has items: 3 columns (sidebar open) or 4 columns (sidebar closed) for products + 1 for cart
      return isSidebarCollapsed
        ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4" // 4 columns for products when sidebar closed
        : "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3" // 3 columns for products when sidebar open
    } else {
      // When no cart items: use full width
      return isSidebarCollapsed
        ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5" // 5 columns when sidebar closed
        : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4" // 4 columns when sidebar open
    }
  }

  

  return (
    <div className="pb-20 sm:pb-24 lg:pb-6">
      <div className={`flex  gap-4 lg:gap-6 p-3 sm:p-4 lg:p-6 pt-4 sm:pt-6`}>
        {/* Products Section */}
        <section
          className={`${viewMode === "list"
            ? "flex-1 space-y-3 sm:space-y-4"
            : `flex-1 grid gap-2 sm:gap-3 lg:gap-4 ${getGridColumns()}`
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

        {/* Desktop Cart Sidebar - Only show on large screens when in grid mode */}
        <AnimatePresence>

        {/* {cartItems.length > 0 && (
          <aside className={`hidden lg:block w-80 xl:w-96 top-0 h-screen transition-transform duration-2000 ease-in-out   ${isSidebarCollapsed ? "absolute top-0 right-10" : "right-0" }  absolute " aria-label="Selected items`}>
            <motion.div animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      transition={{ duration: 1 }} className={`bg-gradient-to-br transition-transform duration-500 ease-in-out right-0 ${isSidebarCollapsed ? "w-inherit" : "w-80 right-4"}
               from-white m-3  to-blue-50 rounded-2xl shadow-2xl border border-[#1a72dd]/20 p-4 lg:p-6 absolute overflow-hidden flex flex-col`} style={{ height: "calc(100vh - 2rem)" }}>
              <div className="absolute top-0 left-0 w-24 h-24 bg-[#1a72dd]/5 rounded-full -translate-x-12 -translate-y-12 blur-xl opacity-50"></div>
              <div className="absolute bottom-0 right-0 w-20 h-20 bg-[#1557b8]/5 rounded-full translate-x-10 translate-y-10 blur-xl opacity-50"></div>

              <div className="mb-4">
                <h3 className="text-lg font-bold text-[#2a3256] flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-[#1a72dd]" />
                  Selected Items ({totalItems})
                </h3>
                <div className="h-1 bg-gradient-to-r from-[#1a72dd] to-[#1557b8] rounded-full w-20 mt-2"></div>
              </div>

              <div className="space-y-3 flex-1 overflow-y-auto">
                {cartItems.map((item) => (
                  <CartItemCard
                    key={item.id}
                    item={item}
                    onQuantityChange={onQuantityChange}
                    onRemove={onRemoveFromCart}
                  />
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={onProceedToPayment}
                  className="w-full bg-gradient-to-r from-[#1a72dd] to-[#1557b8] rounded-xl p-3 text-white hover:from-[#1557b8] hover:to-[#1a72dd] transition-all duration-200 hover:scale-105 shadow-lg"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold">Total:</span>
                    <span className="text-lg font-bold">{totalAmount} PKR</span>
                  </div>
                </button>
              </div>
            </motion.div>
          </aside>
        )} */}
        </AnimatePresence>
      </div>

      {/* Mobile Floating Cart Button */}
      {cartItems.length > 0 && (
        <div className="lg:hidden">
          {/* Floating Cart Button */}
          <button
            onClick={() => setShowMobileCart(true)}
            className="fixed bottom-4 right-4 bg-gradient-to-r from-[#1a72dd] to-[#1557b8] text-white rounded-full p-3 shadow-2xl hover:scale-110 transition-all duration-200 z-30 border-4 border-white"
          >
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              <span className="font-bold text-sm">{totalItems}</span>
            </div>
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
              {totalItems}
            </div>
          </button>

          {/* Mobile Cart Bottom Sheet */}
          {showMobileCart && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-end">
              <div className="bg-white rounded-t-3xl w-full max-h-[80vh] overflow-hidden animate-in slide-in-from-bottom duration-300">
                <div className="bg-gradient-to-r from-[#1a72dd] to-[#1557b8] text-white p-4 flex justify-between items-center">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Cart ({totalItems} items)
                  </h2>
                  <button
                    onClick={() => setShowMobileCart(false)}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-4 max-h-80 overflow-y-auto">
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <CartItemCard
                        key={item.id}
                        item={item}
                        onQuantityChange={onQuantityChange}
                        onRemove={onRemoveFromCart}
                        isCompact={true}
                      />
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-200 p-4 bg-gray-50">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-lg font-semibold text-[#2a3256]">Total:</span>
                    <span className="text-xl font-bold text-[#1a72dd]">{totalAmount} PKR</span>
                  </div>
                  <div className="flex gap-3 mb-4">
                    <button
                      onClick={() => setShowMobileCart(false)}
                      className="flex-1 bg-gray-200 text-[#2a3256] py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                    >
                      Continue Shopping
                    </button>
                    <button
                      onClick={() => {
                        setShowMobileCart(false)
                        onProceedToPayment()
                      }}
                      className="flex-1 bg-gradient-to-r from-[#1a72dd] to-[#1557b8] text-white py-3 rounded-xl font-semibold hover:from-[#1557b8] hover:to-[#1a72dd] transition-all duration-200 shadow-lg"
                    >
                      Proceed to Payment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
