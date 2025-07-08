"use client"

import { useState, useCallback, useMemo, useTransition } from "react"
import { ArrowLeft, Search, LayoutGrid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ProductGrid from "../components/product-grid"
import NumericKeypad from "../components/numeric-keypad"
import PaymentMethod from "../components/payment-method"
import SuccessScreen from "../components/success-screen"
import CartSummary from "../components/cart-summary"

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



export default function CashierPage() {
  const [currentView, setCurrentView] = useState<ViewType>("products")
  const [selectedCategory, setSelectedCategory] = useState("All Product")
  const [cart, setCart] = useState<CartItem[]>([])
  const [manualPrice, setManualPrice] = useState("")
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [productList, setProductList] = useState(initialProducts)
  const [searchQuery, setSearchQuery] = useState("")
  const [isPending, startTransition] = useTransition()

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

  const handleCheckout = useCallback(() => {
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
    <header className="bg-white/95 backdrop-blur-md p-4 border-b border-gray-200/50 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        {currentView !== "products" && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentView("products")}
            className="text-[#1a72dd] hover:bg-[#1a72dd]/10 rounded-xl transition-all duration-200"
            aria-label="Go back to products"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        )}

        <h1 className="text-xl font-bold text-[#1a72dd] flex-1 text-center">
          {currentView === "products" && "Cashier"}
          {currentView === "manual" && "Manual Input"}
          {currentView === "payment" && "Payment Method"}
        </h1>

        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-[#1a72dd] hover:bg-[#1a72dd]/10 rounded-xl transition-all duration-200"
            aria-label="Search products"
          >
            <Search className="w-5 h-5" />
          </Button>

          {currentView === "products" && (
            <Button
              variant="outline"
              size="sm"
              onClick={toggleViewMode}
              className="text-[#1a72dd] border-[#1a72dd] bg-transparent hover:bg-[#1a72dd] hover:text-white px-3 rounded-xl transition-all duration-200 flex items-center gap-2"
              aria-label={`Switch to ${viewMode === "grid" ? "list" : "grid"} view`}
            >
              {viewMode === "grid" ? <List className="w-4 h-4" /> : <LayoutGrid className="w-4 h-4" />}
              {viewMode === "grid" ? "List" : "Grid"}
            </Button>
          )}
        </div>
      </div>

      {currentView === "products" && (
        <div className="flex items-center gap-4">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="flex-1 h-12 border-2 border-gray-200 rounded-xl font-medium focus:border-[#1a72dd] bg-white hover:bg-gray-50 transition-all duration-200 shadow-sm">
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
            className="text-[#1a72dd] border-[#1a72dd] bg-transparent hover:bg-[#1a72dd] hover:text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-sm"
          >
            Manual Input
          </Button>
        </div>
      )}
    </header>
  )

  if (currentView === "success") {
    return <SuccessScreen onPrintReceipt={() => console.log("Print receipt")} onNextOrder={handleNextOrder} />
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-[#f7f8fa] to-[#e8f4fd]">
      {renderHeader()}

      <main className="flex-1 overflow-auto">
        {currentView === "products" && (
          <ProductGrid
            products={filteredProducts}
            onQuantityChange={handleQuantityChange}
            onAddToCart={handleAddToCart}
            viewMode={viewMode}
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

      {currentView === "products" && cart.length > 0 && (
        <CartSummary items={cart} total={totalAmount} onCheckout={handleCheckout} />
      )}
    </div>
  )
}
