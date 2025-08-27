"use client"

import { useState, useCallback, useMemo, useTransition, useEffect } from "react"
import { useParams } from "next/navigation"
import { ArrowLeft, Search, LayoutGrid, List, ShoppingCart, X, Plus, Minus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ProductGrid from "../components/product-grid"
import NumericKeypad from "../components/numeric-keypad"
import PaymentMethod from "../components/payment-method"
import SuccessScreen from "../components/success-screen"
// import CartSummary from "../components/cart-summary" // Unused import
import OrderSummary from "../components/order-summary"
import ComboSection from "../components/combo-section"
import React from "react"
// import { useUserDataStore } from "@/lib/store" // Unused import
import { useProducts, Product as APIProduct } from "@/hooks/use-products"
import { useCatalogs } from "@/hooks/use-catalogs"
import { useProductCategories } from "@/hooks/use-product-categories"
import { useCatalogContext } from "@/lib/contexts/CatalogContext"
import { useCatalogChangeListener } from "@/hooks/use-catalog-change-listener"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import ProductForm from "@/components/product-form"
import { Button } from "@/components/ui/button"
import { Combo } from "@/hooks/use-combos"

// UI Product interface for the cashier page
interface Product {
  attachments: any;
  id: string
  name: string
  price: number
  image: string
  quantity?: number
  productName?: string
  category?: string
  description?: string
  status?: "active" | "inactive" | "draft"
  categoryId?: string
  cost?: number
}

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  isCombo?: boolean
  comboId?: string
}

interface CashierPageProps {
  onSidebarToggle?: (collapsed: boolean) => void
}

type ViewType = "products" | "manual" | "payment" | "success"
type ViewMode = "grid" | "list"




export default function CashierPage({ onSidebarToggle }: CashierPageProps) {
  const params = useParams()
  
  // Get catalog and category from URL params
  const catalogIdFromUrl = params?.userId as string
  const categoryIdFromUrl = params?.Id as string
  
  const [currentView, setCurrentView] = useState<ViewType>("products")
  const [cart, setCart] = useState<CartItem[]>([])
  const [manualPrice, setManualPrice] = useState("")
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [showOrderSummary, setShowOrderSummary] = useState(false)
  const [combosInCart, setCombosInCart] = useState<string[]>([])
  const [, startTransition] = useTransition()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isLoadingCatalogForProduct, setIsLoadingCatalogForProduct] = useState(false)
  
  // Use catalog context for global state management
  const {
    selectedCatalog,
    selectedCategory,
    selectedCategoryId,
    catalogData,
    isLoading: catalogLoading,
    locationId,
    updateCatalog,
    updateCategory
  } = useCatalogContext()
  
  // Use the products API with category filtering
  const { products: apiProducts, isLoading: productsLoading, deleteProduct } = useProducts(1, 1000) // Get more products for filtering
  
  // Use the catalogs API
  const { catalogs, isLoading: catalogsLoading } = useCatalogs()
  
  // Use the categories API
  const { data: categories = [], isLoading: categoriesLoading } = useProductCategories()
  
  // Listen for catalog changes and invalidate queries
  useCatalogChangeListener()
  
  // Debug logging for catalog data
  console.log("CashierPage Catalog Debug:", {
    selectedCatalog,
    selectedCategoryId,
    selectedCategory,
    catalogData,
    catalogLoading,
    catalogIdFromUrl,
    categoryIdFromUrl,
    isLoadingCatalogForProduct,
    currentPath: typeof window !== 'undefined' ? window.location.pathname : 'server-side'
  })
  
  // Function to get updated params from current URL
  const getUpdatedParams = useCallback(() => {
    if (typeof window === 'undefined') {
      return {
        catalogId: "",
        categoryId: "",
        isProductCreation: false
      }
    }
    
    const currentPath = window.location.pathname
    const pathParts = currentPath.split('/').filter(Boolean)
    
    console.log("Getting updated params from path:", currentPath)
    console.log("Path parts:", pathParts)
    
    const updatedParams = {
      catalogId: "",
      categoryId: "",
      isProductCreation: false
    }
    
    if (pathParts.length >= 2 && pathParts[0] === "catalogs") {
      updatedParams.catalogId = pathParts[1]
      
      if (pathParts.length >= 4 && pathParts[2] === "categories") {
        updatedParams.categoryId = pathParts[3]
        
        if (pathParts.length >= 6 && pathParts[4] === "products" && pathParts[5] === "create") {
          updatedParams.isProductCreation = true
        }
      } else if (pathParts.length >= 4 && pathParts[2] === "categories" && pathParts[3] === "create") {
        updatedParams.isProductCreation = true
      }
    } else if (pathParts.length >= 2 && pathParts[0] === "products" && pathParts[1] === "create") {
      updatedParams.isProductCreation = true
    }
    
    console.log("Updated params:", updatedParams)
    return updatedParams
  }, [])
  console.log(apiProducts, "apiProducts");
  
  // Transform API products to match the expected format
  const productList = useMemo(() => {
    return apiProducts.map((apiProduct: APIProduct): Product => ({
      attachments:apiProduct.attachments,
      id: apiProduct.id,
      name: apiProduct.productName || "Unknown Product",
      price: apiProduct.retailPrice || 0,
      image: apiProduct.image || "/placeholder.svg",
      cost: apiProduct.cost || 0,
      quantity: 0,
      productName: apiProduct.productName,
      category: apiProduct.category || "General",
      description: apiProduct.description,
      status: apiProduct.status,
      categoryId: (apiProduct as any).categoryId
    }))
  }, [apiProducts])

  // Product management state
  const [isCreateProductDialogOpen, setIsCreateProductDialogOpen] = useState(false)
  const [isEditProductDialogOpen, setIsEditProductDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
console.log("selectedProduct", selectedProduct);

  const [isMobile, setIsMobile] = useState(false);
  

useEffect(() => {
  if (typeof window === 'undefined') return;
  
  const handleResize = () => {
    setIsMobile(window.innerWidth < 1024);
  };

  handleResize(); // run on mount
  window.addEventListener("resize", handleResize);

  return () => window.removeEventListener("resize", handleResize);
}, []);
  React.useEffect(() => {
    onSidebarToggle?.(isSidebarCollapsed)
  }, [isSidebarCollapsed, onSidebarToggle])


  
  useEffect(() => {
    if(cart.length > 0) {
      setIsSidebarCollapsed(true)
    }
  }, [cart.length])

  // Memoized filtered products with category filtering
  const filteredProducts = useMemo(() => {
    const filtered = productList.filter((product) => {
      // Filter by categoryId if selected (skip if "all" is selected)
      const matchesCategoryId = !selectedCategoryId || selectedCategoryId === "all" || 
        product.categoryId === selectedCategoryId ||
        product.category === selectedCategory // Fallback to category name
      
      // Filter by search query
      const matchesSearch = (product.name || product.productName || "").toLowerCase().includes(searchQuery.toLowerCase())
      
      return matchesCategoryId && matchesSearch
    })
    
    return filtered
  }, [productList, selectedCategoryId, selectedCategory, searchQuery])
console.log(filteredProducts,"filteredProducts");
  // Debug logging (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.log("Debug Info:", {
      selectedCatalog,
      selectedCategoryId,
      selectedCategory,
      totalProducts: productList.length,
      productsWithCategoryId: productList.filter(p => p.categoryId).length,
      productsWithCategory: productList.filter(p => p.category).length,
      filteredProductsCount: filteredProducts.length,
      sampleProduct: productList[0],
      sampleFilteredProduct: filteredProducts[0]
    })
  }

  // Memoized total calculation
  const totalAmount = useMemo(() => {
    const total = cart.reduce((total, item) => total + item.price * item.quantity, 0)
    return Number(total.toFixed(2))
  }, [cart])
  
  const handleQuantityChange = useCallback((productId: string, quantity: number) => {
    startTransition(() => {
      setCart((prev) => {
        const existingItem = prev.find((item) => item.id === productId)
        const product = productList.find((p) => p.id === productId)!

        if (quantity === 0) {
          const itemToRemove = prev.find((item) => item.id === productId)
          if (itemToRemove?.isCombo && itemToRemove.comboId) {
            setCombosInCart((prevCombos) => prevCombos.filter(id => id !== itemToRemove.comboId))
          }
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
  }, [productList])

  const handleAddToCart = useCallback(
    (productId: string) => {
      handleQuantityChange(productId, 1)
    },
    [handleQuantityChange],
  )

  const handleRemoveFromCart = useCallback((productId: string) => {
    startTransition(() => {
      setCart((prev) => {
        const itemToRemove = prev.find((item) => item.id === productId)
        if (itemToRemove?.isCombo && itemToRemove.comboId) {
          setCombosInCart((prevCombos) => prevCombos.filter(id => id !== itemToRemove.comboId))
        }
        return prev.filter((item) => item.id !== productId)
      })
    })
  }, [])

  const handleAddComboToCart = useCallback((combo: Combo) => {
    startTransition(() => {
      const comboItem: CartItem = {
        id: `combo-${combo.id}`,
        name: combo.name,
        price: combo.bundlePrice,
        quantity: 1,
        isCombo: true,
        comboId: combo.id
      }
      
      setCart((prev) => {
        const existingItem = prev.find((item) => item.id === comboItem.id)
        if (existingItem) {
          return prev.map((item) => 
            item.id === comboItem.id 
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        } else {
          setCombosInCart((prevCombos) => [...prevCombos, combo.id])
          return [...prev, comboItem]
        }
      })
    })
  }, [])



  const handleProceedToPayment = useCallback(() => {
    setShowOrderSummary(false)
    setCurrentView("payment")
  }, [])

  const handlePaymentSelect = useCallback((_method: "cash" | "card") => {
    // Simulate payment processing
    setTimeout(() => {
      setCurrentView("success")
    }, 500)
  }, [])

  const handleNextOrder = useCallback(() => {
    setCart([])
    setCurrentView("products")
    setSearchQuery("")
  }, [])

  const handleManualEntry = useCallback(() => {
    const price = Number.parseInt(manualPrice) || 0
    if (price > 0) {
      const manualItem: CartItem = {
        id: Date.now().toString(),
        name: "Manual Item",
        price,
        quantity: 1,
      }
      setCart((prev) => [...prev, manualItem])
    }
    setCurrentView("products")
    setManualPrice("")
  }, [manualPrice])

  // Product management handlers
  const handleCreateProduct = useCallback(() => {
    // Update URL params to include product creation context
    let newUrl = ""
    
    if (selectedCatalog && selectedCatalog !== "all") {
      if (selectedCategoryId && selectedCategoryId !== "all") {
        // Navigate to product creation within specific category
        newUrl = `/catalogs/${selectedCatalog}/categories/${selectedCategoryId}/products/create`
      } else {
        // Navigate to product creation within catalog (no specific category)
        newUrl = `/catalogs/${selectedCatalog}/categories/create`
      }
    } else {
      // Navigate to general product creation
      newUrl = `/products/create`
    }
    
    console.log("Updating URL for product creation:", newUrl)
    console.log("Current params:", { selectedCatalog, selectedCategoryId, selectedCategory })
    
    // Update URL using window.history
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', newUrl)
      
      // Dispatch custom event for product creation
      window.dispatchEvent(new CustomEvent('productCreationStarted', { 
        detail: { 
          catalogId: selectedCatalog,
          categoryId: selectedCategoryId,
          categoryName: selectedCategory
        } 
      }))
    }
    
    // Load catalog data when creating a product
    if (selectedCatalog && selectedCatalog !== "all") {
      console.log("Loading catalog data for product creation:", selectedCatalog)
      setIsLoadingCatalogForProduct(true)
      // Catalog data is now managed by context, no need to refetch
      setIsLoadingCatalogForProduct(false)
    }
    
    console.log("Opening create product dialog with category:", {
      selectedCategoryId,
      selectedCategory,
      catalogId: selectedCatalog
    })
    setIsCreateProductDialogOpen(true)
  }, [selectedCatalog, selectedCategoryId, selectedCategory])

  const handleEditProduct = useCallback((product: Product) => {
    setSelectedProduct(product)
    setIsEditProductDialogOpen(true)
  }, [])

  const handleDeleteProduct = useCallback(async (productId: string) => {
    try {
      // Find the product to get its attachments
      const product = apiProducts.find(p => p.id === productId)
      const attachments = product?.attachments && Array.isArray(product.attachments) ? product.attachments : undefined
      
      await deleteProduct.mutateAsync({ id: productId, attachments })
    } catch (error) {
      console.error("Failed to delete product:", error)
    }
  }, [deleteProduct, apiProducts])

  const handleCreateProductSuccess = useCallback(() => {
    console.log("Product creation successful, restoring original URL")
    
    // Restore the original URL based on current selection
    let restoreUrl = ""
    
    if (selectedCatalog && selectedCatalog !== "all") {
      if (selectedCategoryId && selectedCategoryId !== "all") {
        restoreUrl = `/catalogs/${selectedCatalog}/categories/${selectedCategoryId}/products`
      } else {
        restoreUrl = `/catalogs/${selectedCatalog}/categories`
      }
    } else {
      restoreUrl = "/"
    }
    
    console.log("Restoring URL to:", restoreUrl)
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', restoreUrl)
      
      // Dispatch event for product creation success
      window.dispatchEvent(new CustomEvent('productCreationSuccess', { 
        detail: { 
          catalogId: selectedCatalog,
          categoryId: selectedCategoryId
        } 
      }))
    }
    
    setIsCreateProductDialogOpen(false)
  }, [selectedCatalog, selectedCategoryId])

  const handleEditProductSuccess = useCallback(() => {
    setIsEditProductDialogOpen(false)
    setSelectedProduct(null)
  }, [])
  
  const handleCreateProductCancel = useCallback(() => {
    console.log("Product creation canceled, restoring original URL")
    
    // Restore the original URL based on current selection
    let restoreUrl = ""
    
    if (selectedCatalog && selectedCatalog !== "all") {
      if (selectedCategoryId && selectedCategoryId !== "all") {
        restoreUrl = `/catalogs/${selectedCatalog}/categories/${selectedCategoryId}/products`
      } else {
        restoreUrl = `/catalogs/${selectedCatalog}/categories`
      }
    } else {
      restoreUrl = "/"
    }
    
    console.log("Restoring URL to:", restoreUrl)
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', restoreUrl)
      
      // Dispatch event for product creation cancel
      window.dispatchEvent(new CustomEvent('productCreationCancel', { 
        detail: { 
          catalogId: selectedCatalog,
          categoryId: selectedCategoryId
        } 
      }))
    }
    
    setIsCreateProductDialogOpen(false)
  }, [selectedCatalog, selectedCategoryId])

  const toggleViewMode = useCallback(() => {
    setViewMode((prev) => (prev === "grid" ? "list" : "grid"))
  }, [])

  // Track selectedCategoryId changes
  useEffect(() => {
    console.log("selectedCategoryId changed:", selectedCategoryId)
  }, [selectedCategoryId])

  // Catalog and category selection handlers
  const handleCatalogSelect = useCallback((catalogId: string) => {
    console.log("CashierPage: Catalog selection", { catalogId })
    updateCatalog(catalogId)
  }, [updateCatalog])

  const handleCategorySelect = useCallback((categoryId: string) => {
    console.log("CashierPage: Category selection", { categoryId })
    
    // Find category name for display
    const category = categories.find(cat => cat.id === categoryId)
    const categoryName = category?.categoryName || "All Product"
    
    updateCategory(categoryId, categoryName)
  }, [categories, updateCategory])

  // Filter categories for selected catalog
  const filteredCategories = useMemo(() => {
    if (!selectedCatalog || selectedCatalog === "all") return []
    return categories.filter(category => category.menuId === selectedCatalog)
  }, [categories, selectedCatalog])

  const renderHeader = () => (
    <header
      className={`bg-white/95 dark:bg-gray-800/95 backdrop-blur-md ${cart.length > 0 && !isMobile ? "w-3/" : ""} rounded-lg p-3 sm:p-4 border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm`}
    >
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-3">
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
          {currentView === "products" && (
            <div className="flex flex-col items-center">
              <span>Cashier</span>
              {selectedCatalog && selectedCatalog !== "all" && (
                <span className="text-sm font-normal text-gray-600">
                  {catalogs.find(c => c.id === selectedCatalog)?.name}
                  {selectedCategoryId && selectedCategoryId !== "all" && ` - ${categories.find(c => c.id === selectedCategoryId)?.categoryName}`}
                </span>
              )}
            </div>
          )}
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
              className="pl-10 sm:pl-12 h-10 sm:h-12 border-2 border-gray-200 dark:border-gray-600 rounded-xl font-medium focus:border-[#1a72dd] dark:focus:border-blue-400 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 shadow-sm dark:text-gray-200"
            />
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Catalog Selection */}
            <Select value={selectedCatalog || "all"} onValueChange={handleCatalogSelect}>
              <SelectTrigger className="flex-1 h-10 sm:h-12 border-2 border-gray-200 dark:border-gray-600 rounded-xl font-medium focus:border-[#1a72dd] dark:focus:border-blue-400 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 shadow-sm dark:text-gray-200">
                <SelectValue placeholder={catalogsLoading ? "Loading catalogs..." : "Select Catalog"}>
                  {selectedCatalog && selectedCatalog !== "all" && catalogs.find(c => c.id === selectedCatalog)?.name}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="rounded-xl border-2 border-gray-200 shadow-xl backdrop-blur-md">
                <SelectItem
                  value="all"
                  className="rounded-lg hover:bg-[#1a72dd]/10 focus:bg-[#1a72dd]/10 transition-colors"
                >
                  All Catalogs
                </SelectItem>
                {catalogs.map((catalog) => (
                  <SelectItem
                    key={catalog.id}
                    value={catalog.id}
                    className="rounded-lg hover:bg-[#1a72dd]/10 focus:bg-[#1a72dd]/10 transition-colors"
                  >
                    {catalog.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Category Selection */}
            <Select 
              value={selectedCategoryId || "all"} 
              onValueChange={handleCategorySelect}
              disabled={!selectedCatalog || selectedCatalog === "all" || categoriesLoading}
            >
              <SelectTrigger className="flex-1 h-10 sm:h-12 border-2 border-gray-200 dark:border-gray-600 rounded-xl font-medium focus:border-[#1a72dd] dark:focus:border-blue-400 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 shadow-sm dark:text-gray-200">
                <SelectValue placeholder={!selectedCatalog || selectedCatalog === "all" ? "Select catalog first" : categoriesLoading ? "Loading categories..." : "Select Category"}>
                  {selectedCategoryId && selectedCategoryId !== "all" && categories.find(c => c.id === selectedCategoryId)?.categoryName}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="rounded-xl border-2 border-gray-200 shadow-xl backdrop-blur-md">
                <SelectItem
                  value="all"
                  className="rounded-lg hover:bg-[#1a72dd]/10 focus:bg-[#1a72dd]/10 transition-colors"
                >
                  All Categories
                </SelectItem>
                {filteredCategories.map((category) => (
                  <SelectItem
                    key={category.id}
                    value={category.id}
                    className="rounded-lg hover:bg-[#1a72dd]/10 focus:bg-[#1a72dd]/10 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span style={{ color: category.color }}>{category.icon}</span>
                      {category.categoryName}
                    </div>
                  </SelectItem>
                ))}
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
   <div className="flex h-screen bg-gradient-to-br from-[#f7f8fa] to-[#e8f4fd] dark:from-[#1a1a1a] dark:to-[#2a2a2a]">
      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 overflow-hidden ${cart.length > 0 && !isMobile ? "mr-80" : ""}`}
      >
      {renderHeader()}

      <main className="flex-1 overflow-y-auto overflow-x-hidden w-full">
        {currentView === "products" && (
          <>
            {/* Combo Section */}
            <div className="w-full">
              <ComboSection 
                onAddComboToCart={handleAddComboToCart}
                combosInCart={combosInCart}
                onEditCombo={(combo) => {
                  console.log('Edit combo:', combo)
                  // TODO: Implement combo editing
                }}
                locationId={locationId}
              />
            </div>
            
            {productsLoading && apiProducts.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a72dd] mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-300">Loading products...</p>
                </div>
              </div>
            ) : (
              <ProductGrid
                products={filteredProducts}
                cartItems={cart}
                onQuantityChange={handleQuantityChange}
                onAddToCart={handleAddToCart}
                onRemoveFromCart={handleRemoveFromCart}
                onProceedToPayment={handleProceedToPayment}
                viewMode={viewMode}
                isSidebarCollapsed={isSidebarCollapsed}
                onEditProduct={handleEditProduct}
                onDeleteProduct={handleDeleteProduct}
                onCreateProduct={handleCreateProduct}
                currentFilter={selectedCategory !== "All Product" ? selectedCategory : searchQuery || undefined}
                isCreatingProduct={isLoadingCatalogForProduct}
              />
            )}
          </>
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
        <div className="fixed right-0 top-0 h-full w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 shadow-lg flex flex-col z-40">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex items-center gap-2 text-[#1a72dd] dark:text-blue-400 font-semibold">
              <ShoppingCart className="w-5 h-5" />
              <span>Selected Items ({cart.reduce((sum, item) => sum + item.quantity, 0)})</span>
            </div>
          </div>

          {/* Selected Items List */}
          <div className="flex-1 overflow-auto p-4">
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-10 h-10 ${item.isCombo ? 'bg-green-600' : 'bg-[#1a72dd]'} dark:bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0`}>
                      <ShoppingCart className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-800 dark:text-gray-200 truncate">{item.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {item.price} PKR each
                        {item.isCombo && <span className="ml-2 text-green-600 font-medium">(Combo)</span>}
                      </p>
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
                      <span className="font-bold text-[#1a72dd]">{(item.price * item.quantity).toFixed(2)} PKR</span>
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

      {/* Create Product Dialog */}
      <Dialog open={isCreateProductDialogOpen} onOpenChange={setIsCreateProductDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Product</DialogTitle>
          </DialogHeader>
                          <ProductForm 
                            selectedCategoryId={selectedCategoryId !== "all" ? selectedCategoryId : ""}
                            onSuccess={handleCreateProductSuccess} 
                            onCancel={handleCreateProductCancel}
                          />
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={isEditProductDialogOpen} onOpenChange={setIsEditProductDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
                          <ProductForm
                product={{
                  id: selectedProduct.id,
                  productName: selectedProduct.productName || selectedProduct.name,
                  price: selectedProduct.price,
                  image: selectedProduct.image,
                  cost: selectedProduct.cost,
                  description: selectedProduct.description,
                  category: selectedProduct.category,
                  status: selectedProduct.status,
                  stock: 0,
                  createdAt: "",
                  updatedAt: "",
                  companyId: "",
                  locationId: "",
                  catalogId: ""
                } as any}
                selectedCategoryId={selectedCategoryId !== "all" ? selectedCategoryId : ""}
                onSuccess={handleEditProductSuccess}
                onCancel={() => setIsEditProductDialogOpen(false)}
              />
          )}
        </DialogContent>
      </Dialog>

    </div>
  )
}
