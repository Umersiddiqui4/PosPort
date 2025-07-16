"use client"

import { useState, useCallback, useMemo, useTransition, useEffect } from "react"
import { ArrowLeft, Search, LayoutGrid, List, ShoppingCart, Menu, Sidebar, X, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ProductGrid from "../components/product-grid"
import NumericKeypad from "../components/numeric-keypad"
import PaymentMethod from "../components/payment-method"
import SuccessScreen from "../components/success-screen"
import CartSummary from "../components/cart-summary"
import OrderSummary from "../components/order-summary"
import React from "react"

interface Product {
  id: number
  name: string
  price: number
  image: string
  quantity?: number
  category: string
}

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
}

interface CashierPageProps {
  onMobileToggle?: () => void
  onSidebarToggle?: (collapsed: boolean) => void
}

type ViewType = "products" | "manual" | "payment" | "success"
type ViewMode = "grid" | "list"

const initialProducts: Product[] = [
  {
    id: 1,
    name: "Salad Egg",
    price: 1150,
    image: "https://www.daysoftheyear.com/cdn-cgi/image/dpr=1%2Cf=auto%2Cfit=cover%2Ch=675%2Cq=85%2Cw=1200/wp-content/uploads/national-fast-food-day.jpg",
    quantity: 0,
    category: "Special Menu",
  },
  {
    id: 2,
    name: "Maggi Sale",
    price: 750,
    image: "https://media.istockphoto.com/id/184354422/photo/club-sandwich.jpg?s=612x612&w=0&k=20&c=oekKP1LciqidyIPbTMe6CJp4M8iaasktEjqx2OcxpAU=",
    quantity: 0,
    category: "Main Course",
  },
  {
    id: 3,
    name: "Maggi Black Paper",
    price: 1500,
    image: "https://m-foodz.com/pk/wp-content/uploads/2023/05/Fast-Food-Restaurants-In-Karachi.jpg",
    quantity: 0,
    category: "Main Course",
  },
  {
    id: 4,
    name: "Chicken Biryani",
    price: 2000,
    image: "https://images.getrecipekit.com/20230606152327-25_Instant_ramen.jpg?aspect_ratio=16:9&quality=90&",
    quantity: 0,
    category: "Special Menu",
  },
  {
    id: 5,
    name: "Beef Karahi",
    price: 1800,
    image: "https://images.immediate.co.uk/production/volatile/sites/30/2024/12/Chicken-Karahi-847828f.jpg",
    quantity: 0,
    category: "Main Course",
  },
  {
    id: 6,
    name: "Fish Curry",
    price: 1200,
    image: "https://i.ytimg.com/vi/NvQMLzhLm88/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLA5rGZOuqqg-bP7A21-rLdC4r3sOg",
    quantity: 0,
    category: "Special Menu",
  },
  {
    id: 7,
    name: "Pepperoni Pizza",
    price: 1600,
    image: "https://www.spiceandcolour.com/wp-content/uploads/2020/06/samosa-de-pollo-1.jpg",
    quantity: 0,
    category: "Fast Food",
  },
  {
    id: 8,
    name: "Cheese Burger",
    price: 900,
    image: "https://upload.wikimedia.org/wikipedia/commons/a/a1/Momo_nepal.jpg",
    quantity: 0,
    category: "Fast Food",
  },
  {
    id: 9,
    name: "French Fries",
    price: 500,
    image: "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    quantity: 0,
    category: "Fast Food",
  },
];


export default function CashierPage({ onMobileToggle, onSidebarToggle }: CashierPageProps) {
  const [currentView, setCurrentView] = useState<ViewType>("products")
  const [selectedCategory, setSelectedCategory] = useState("All Product")
  const [cart, setCart] = useState<CartItem[]>([])
  const [manualPrice, setManualPrice] = useState("")
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [productList, setProductList] = useState(initialProducts)
  const [searchQuery, setSearchQuery] = useState("")
  const [showOrderSummary, setShowOrderSummary] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

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

  React.useEffect(() => {
    onSidebarToggle?.(isSidebarCollapsed)
  }, [isSidebarCollapsed, onSidebarToggle])

  const handleSidebarToggle = useCallback(() => {
    setIsSidebarCollapsed((prev) => !prev)
  }, [])
  console.log(isSidebarCollapsed, "isSidebarCollapsed");
  
  useEffect(() => {

    if(cart.length > 0) {
      setIsSidebarCollapsed(true)}

    }, [cart.length])

  // Memoized filtered products
  const filteredProducts = useMemo(() => {
    return productList.filter((product) => {
      const matchesCategory = selectedCategory === "All Product" || product.category === selectedCategory
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [productList, selectedCategory, searchQuery])

  // Memoized total calculation
  const totalAmount = useMemo(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }, [cart])

  console.log("Cart Items:", cart);
  
  const handleQuantityChange = useCallback((productId: number, quantity: number) => {
    startTransition(() => {
      setProductList((prev) => prev.map((product) => (product.id === productId ? { ...product, quantity } : product)))

      setCart((prev) => {
        const existingItem = prev.find((item) => item.id === productId)
        const product = initialProducts.find((p) => p.id === productId)!

        if (quantity === 0) {
          return prev.filter((item) => item.id !== productId)
        }

        if (existingItem) {
          return prev.map((item) => (item.id === productId ? { ...item, quantity } : item))
        } else {
          return [
            ...prev,
            {
              id: productId,
              name: product.name,
              price: product.price,
              quantity,
            },
          ]
        }
      })
    })
  }, [])

  const handleAddToCart = useCallback(
    (productId: number) => {
      handleQuantityChange(productId, 1)
    },
    [handleQuantityChange],
  )

  const handleRemoveFromCart = useCallback((productId: number) => {
    startTransition(() => {
      setProductList((prev) =>
        prev.map((product) => (product.id === productId ? { ...product, quantity: 0 } : product)),
      )
      setCart((prev) => prev.filter((item) => item.id !== productId))
    })
  }, [])

  const handleCheckout = useCallback(() => {
    setShowOrderSummary(true)
  }, [])

  const handleProceedToPayment = useCallback(() => {
    setShowOrderSummary(false)
    setCurrentView("payment")
  }, [])

  const handlePaymentSelect = useCallback((method: "cash" | "card") => {
    // Simulate payment processing
    setTimeout(() => {
      setCurrentView("success")
    }, 500)
  }, [])

  const handleNextOrder = useCallback(() => {
    setCart([])
    setProductList(initialProducts)
    setCurrentView("products")
    setSearchQuery("")
  }, [])

  const handleManualEntry = useCallback(() => {
    const price = Number.parseInt(manualPrice) || 0
    if (price > 0) {
      const manualItem: CartItem = {
        id: Date.now(),
        name: "Manual Item",
        price,
        quantity: 1,
      }
      setCart((prev) => [...prev, manualItem])
    }
    setCurrentView("products")
    setManualPrice("")
  }, [manualPrice])

  const toggleViewMode = useCallback(() => {
    setViewMode((prev) => (prev === "grid" ? "list" : "grid"))
  }, [])

  const renderHeader = () => (
    <header
      className={`bg-white/95 backdrop-blur-md ${cart.length > 0 && !isMobile ? "w-3/" : ""} rounded-lg p-3 sm:p-4 border-b border-gray-200/50 shadow-sm`}
    >
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-3">
          {/* Desktop Hamburger Menu */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSidebarToggle}
            className="hidden md:flex text-[#1a72dd] hover:bg-[#1a72dd]/10 rounded-xl transition-all duration-200"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5" />
          </Button>

          {/* Mobile Hamburger Menu */}
          {onMobileToggle && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onMobileToggle}
              className="md:hidden text-[#1a72dd] hover:bg-[#1a72dd]/10 rounded-xl transition-all duration-200"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </Button>
          )}

          {/* Back Button for non-products views */}
          {currentView !== "products" && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentView("products")}
              className="text-[#1a72dd] hover:bg-[#1a72dd]/10 rounded-xl transition-all duration-200"
              aria-label="Go back to products"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          )}
        </div>

        <h1 className="text-lg sm:text-xl font-bold text-[#1a72dd] flex-1 text-center">
          {currentView === "products" && "Cashier"}
          {currentView === "manual" && "Manual Input"}
          {currentView === "payment" && "Payment Method"}
        </h1>

        <div className="flex gap-2">
          {currentView === "products" && cart.length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowOrderSummary(true)}
              className="text-[#1a72dd] hover:bg-[#1a72dd]/10 rounded-xl transition-all duration-200 relative"
              aria-label="View cart"
            >
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </Button>
          )}

          {currentView === "products" && (
            <Button
              variant="outline"
              size="sm"
              onClick={toggleViewMode}
              className="text-[#1a72dd] border-[#1a72dd] bg-transparent hover:bg-[#1a72dd] hover:text-white px-2 sm:px-3 rounded-xl transition-all duration-200 flex items-center gap-1 sm:gap-2"
              aria-label={`Switch to ${viewMode === "grid" ? "list" : "grid"} view`}
            >
              {viewMode === "grid" ? (
                <List className="w-3 h-3 sm:w-4 sm:h-4" />
              ) : (
                <LayoutGrid className="w-3 h-3 sm:w-4 sm:h-4" />
              )}
              <span className="hidden sm:inline">{viewMode === "grid" ? "List" : "Grid"}</span>
            </Button>
          )}
        </div>
      </div>

      {currentView === "products" && (
        <div className="space-y-3  sm:space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 sm:pl-12 h-10 sm:h-12 border-2 border-gray-200 rounded-xl font-medium focus:border-[#1a72dd] bg-white hover:bg-gray-50 transition-all duration-200 shadow-sm"
            />
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="flex-1 h-10 sm:h-12 border-2 border-gray-200 rounded-xl font-medium focus:border-[#1a72dd] bg-white hover:bg-gray-50 transition-all duration-200 shadow-sm">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-2 border-gray-200 shadow-xl backdrop-blur-md">
                <SelectItem
                  value="All Product"
                  className="rounded-lg hover:bg-[#1a72dd]/10 focus:bg-[#1a72dd]/10 transition-colors"
                >
                  All Products
                </SelectItem>
                <SelectItem
                  value="Special Menu"
                  className="rounded-lg hover:bg-[#1a72dd]/10 focus:bg-[#1a72dd]/10 transition-colors"
                >
                  Special Menu
                </SelectItem>
                <SelectItem
                  value="Main Course"
                  className="rounded-lg hover:bg-[#1a72dd]/10 focus:bg-[#1a72dd]/10 transition-colors"
                >
                  Main Course
                </SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => setCurrentView("manual")}
              className="text-[#1a72dd] border-[#1a72dd] bg-transparent hover:bg-[#1a72dd] hover:text-white px-3 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-sm text-sm sm:text-base"
            >
              Manual
            </Button>
          </div>
        </div>
      )}
    </header>
  )

  if (currentView === "success") {
    return <SuccessScreen onPrintReceipt={() => console.log("Print receipt")} onNextOrder={handleNextOrder} />
  }

  return (
   <div className="flex h-screen bg-gradient-to-br from-[#f7f8fa] to-[#e8f4fd]">
      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${cart.length > 0 && !isMobile ? "mr-80" : ""}`}
      >
      {renderHeader()}

      <main className="flex-1 overflow-auto">
        {currentView === "products" && (
          <ProductGrid
            products={filteredProducts}
            cartItems={cart}
            onQuantityChange={handleQuantityChange}
            onAddToCart={handleAddToCart}
            onRemoveFromCart={handleRemoveFromCart}
            onProceedToPayment={handleProceedToPayment}
            viewMode={viewMode}
            isSidebarCollapsed={isSidebarCollapsed}
          />
        )}

        {currentView === "manual" && (
          <NumericKeypad title="Input Price" onValueChange={setManualPrice} onEnter={handleManualEntry} />
        )}

        {currentView === "payment" && (
          <PaymentMethod
            totalAmount={totalAmount}
            onPaymentSelect={handlePaymentSelect}
            onExactAmount={() => handlePaymentSelect("cash")}
          />
        )}
      </main>
      </div>

      {/* Desktop Selected Items Sidebar */}
      {cart.length > 0 && !isMobile && (
        <div className="fixed right-0 top-0 h-full w-80 bg-white border-l border-gray-200 shadow-lg flex flex-col z-40">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center gap-2 text-[#1a72dd] font-semibold">
              <ShoppingCart className="w-5 h-5" />
              <span>Selected Items ({cart.reduce((sum, item) => sum + item.quantity, 0)})</span>
            </div>
          </div>

          {/* Selected Items List */}
          <div className="flex-1 overflow-auto p-4">
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 bg-[#1a72dd] rounded-full flex items-center justify-center flex-shrink-0">
                      <ShoppingCart className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-800 truncate">{item.name}</h4>
                      <p className="text-sm text-gray-600">{item.price} PKR each</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleQuantityChange(item.id, Math.max(1, item.quantity - 1))}
                        className="w-8 h-8 p-0 rounded-full border-gray-300 hover:border-[#1a72dd] hover:text-[#1a72dd]"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="font-bold text-lg min-w-[30px] text-center">{item.quantity}</span>
                      <Button
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="w-8 h-8 p-0 rounded-full bg-[#1a72dd] hover:bg-[#1557b8] text-white"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#1a72dd]">{item.price * item.quantity} PKR</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRemoveFromCart(item.id)}
                        className="w-8 h-8 p-0 rounded-full border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total Section */}
          <div className="p-4 border-t border-gray-200 bg-[#1a72dd] text-white">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold">Total:</span>
              <span className="text-xl font-bold">{totalAmount} PKR</span>
            </div>
            <Button
              onClick={handleProceedToPayment}
              className="w-full bg-white text-[#1a72dd] hover:bg-gray-100 font-semibold py-2"
            >
              Proceed to Payment
            </Button>
          </div>
        </div>
      )}

      {/* Order Summary Modal */}
      {showOrderSummary && (
        <OrderSummary
          items={cart}
          total={totalAmount}
          onClose={() => setShowOrderSummary(false)}
          onProceedToPayment={handleProceedToPayment}
        />
      )}



    </div>
  )
}
