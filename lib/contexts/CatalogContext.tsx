"use client"

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useCatalogById } from '@/hooks/use-cataogById'
import type { Catalog, ProductCategory, Product } from '@/lib/Api/getCatalogById'

interface CatalogContextType {
  selectedCatalog: string
  selectedCategory: string
  selectedCategoryId: string
  catalogData: Catalog | null
  isLoading: boolean
  locationId: string | undefined
  // Helper functions for the new nested structure
  categories: ProductCategory[]
  products: Product[]
  filteredProducts: Product[]
  updateCatalog: (catalogId: string) => void
  updateCategory: (categoryId: string, categoryName: string) => void
  resetCatalog: () => void
}

const CatalogContext = createContext<CatalogContextType | undefined>(undefined)

export const useCatalogContext = () => {
  const context = useContext(CatalogContext)
  if (!context) {
    throw new Error('useCatalogContext must be used within a CatalogProvider')
  }
  return context
}

interface CatalogProviderProps {
  children: React.ReactNode
}

export const CatalogProvider: React.FC<CatalogProviderProps> = ({ children }) => {
  const params = useParams()
  const router = useRouter()
  
  // Get catalog and category from URL params
  // Based on URL structure: /catalogs/{catalogId}/categories/{categoryId}/products
  const catalogIdFromUrl = params?.userId as string
  const categoryIdFromUrl = params?.Id as string
  
  // Also try to extract from the current URL path as fallback
  const getCategoryIdFromPath = () => {
    if (typeof window === 'undefined') return null
    const pathParts = window.location.pathname.split('/').filter(Boolean)
    if (pathParts.length >= 4 && pathParts[0] === 'catalogs' && pathParts[2] === 'categories') {
      return pathParts[3]
    }
    return null
  }
  
  const categoryIdFromPath = getCategoryIdFromPath()
  const finalCategoryIdFromUrl = categoryIdFromUrl || categoryIdFromPath
  
  console.log("CatalogContext: URL params", { 
    catalogIdFromUrl, 
    categoryIdFromUrl,
    categoryIdFromPath,
    finalCategoryIdFromUrl,
    allParams: params 
  })
  
  const [selectedCatalog, setSelectedCatalog] = useState<string>("all")
  const [selectedCategory, setSelectedCategory] = useState("All Product")
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all")
  
  // Fetch catalog data
  const { data: catalogData, isLoading, refetch } = useCatalogById(
    selectedCatalog && selectedCatalog !== "all" ? selectedCatalog : "",
    !!(selectedCatalog && selectedCatalog !== "all") // Only enable when we have a valid catalog ID
  )
  
  // Extract locationId from catalog data
  const locationId = catalogData?.locationId

  // Extract categories from catalog data
  const categories = useMemo(() => {
    console.log("CatalogContext: Extracting categories from catalog data", catalogData?.productCategories?.length || 0)
    return catalogData?.productCategories || []
  }, [catalogData])

  // Extract all products from all categories
  const products = useMemo(() => {
    if (!catalogData?.productCategories) return []
    const allProducts = catalogData.productCategories.flatMap(category => category.products || [])
    console.log("CatalogContext: Extracted products", allProducts.length)
    return allProducts
  }, [catalogData])

  // Filter products based on selected category
  const filteredProducts = useMemo(() => {
    console.log("CatalogContext: Filtering products", { selectedCategoryId, totalProducts: products.length })
    if (selectedCategoryId === "all" || !selectedCategoryId) {
      return products
    }
    const filtered = products.filter(product => product.categoryId === selectedCategoryId)
    console.log("CatalogContext: Filtered products count", filtered.length)
    return filtered
  }, [products, selectedCategoryId])

  // Update catalog selection
  const updateCatalog = useCallback((catalogId: string) => {
    console.log("CatalogContext: Updating catalog", { catalogId, currentSelectedCatalog: selectedCatalog })
    
    setSelectedCatalog(catalogId)
    setSelectedCategoryId("all") // Reset category when catalog changes
    setSelectedCategory("All Product")
    
    // Update URL
    if (catalogId && catalogId !== "all") {
      const newUrl = `/catalogs/${catalogId}/categories`
      console.log("CatalogContext: Navigating to:", newUrl)
      
      if (typeof window !== 'undefined') {
        window.history.pushState({}, '', newUrl)
        
        // Dispatch custom event for immediate updates
        window.dispatchEvent(new CustomEvent('catalogChanged', { 
          detail: { 
            catalogId: catalogId,
            locationId: catalogData?.locationId 
          } 
        }))
      }
    } else {
      console.log("CatalogContext: Navigating to home")
      if (typeof window !== 'undefined') {
        window.history.pushState({}, '', "/")
        
        window.dispatchEvent(new CustomEvent('catalogChanged', { 
          detail: { catalogId: null, locationId: null } 
        }))
      }
    }
  }, [catalogData?.locationId])

  // Update category selection
  const updateCategory = useCallback((categoryId: string, categoryName: string) => {
    const actualCategoryId = categoryId === "all" ? "" : categoryId
    console.log("CatalogContext: Updating category", { 
      categoryId, 
      actualCategoryId, 
      categoryName,
      currentSelectedCategoryId: selectedCategoryId,
      currentSelectedCategory: selectedCategory
    })
    
    setSelectedCategoryId(actualCategoryId)
    setSelectedCategory(categoryName)
    
    // Update URL only - no need to dispatch events or trigger API calls for category changes
    if (selectedCatalog && selectedCatalog !== "all") {
      if (actualCategoryId) {
        const newUrl = `/catalogs/${selectedCatalog}/categories/${actualCategoryId}/products`
        if (typeof window !== 'undefined') {
          window.history.pushState({}, '', newUrl)
        }
      } else {
        const newUrl = `/catalogs/${selectedCatalog}/categories`
        if (typeof window !== 'undefined') {
          window.history.pushState({}, '', newUrl)
        }
      }
    }
  }, [selectedCatalog])

  // Reset catalog
  const resetCatalog = useCallback(() => {
    setSelectedCatalog("all")
    setSelectedCategory("All Product")
    setSelectedCategoryId("all")
    
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', "/")
      window.dispatchEvent(new CustomEvent('catalogChanged', { 
        detail: { catalogId: null, locationId: null } 
      }))
    }
  }, [])

  // Sync with URL params on mount and URL changes
  useEffect(() => {
    console.log("CatalogContext: URL sync effect", { 
      catalogIdFromUrl, 
      categoryIdFromUrl,
      categoryIdFromPath,
      finalCategoryIdFromUrl,
      selectedCatalog, 
      selectedCategoryId 
    })
    
    if (catalogIdFromUrl && catalogIdFromUrl !== selectedCatalog) {
      console.log("CatalogContext: Syncing catalog with URL params", { catalogIdFromUrl, selectedCatalog })
      setSelectedCatalog(catalogIdFromUrl)
    }
    
    if (finalCategoryIdFromUrl && finalCategoryIdFromUrl !== selectedCategoryId) {
      console.log("CatalogContext: Syncing category with URL params", { finalCategoryIdFromUrl, selectedCategoryId })
      setSelectedCategoryId(finalCategoryIdFromUrl)
    }
  }, [catalogIdFromUrl, finalCategoryIdFromUrl, selectedCatalog, selectedCategoryId])

  // Refetch catalog data when selectedCatalog changes
  useEffect(() => {
    if (selectedCatalog && selectedCatalog !== "all") {
      console.log("CatalogContext: Refetching catalog data for", selectedCatalog)
      refetch()
    } else if (selectedCatalog === "all") {
      console.log("CatalogContext: Catalog set to 'all', clearing data")
    }
  }, [selectedCatalog, refetch])

  // Debug: Log when selectedCategoryId changes
  useEffect(() => {
    console.log("CatalogContext: selectedCategoryId changed", { 
      selectedCategoryId, 
      selectedCategory,
      totalProducts: products.length,
      filteredProductsCount: filteredProducts.length
    })
  }, [selectedCategoryId, selectedCategory, products.length, filteredProducts.length])

  // Listen for popstate events (browser back/forward)
  useEffect(() => {
    const handlePopState = () => {
      console.log("CatalogContext: Popstate event detected")
      // Refetch catalog data when URL changes via browser navigation
      if (selectedCatalog !== "all") {
        refetch()
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [selectedCatalog, refetch])

  // Listen for custom catalog change events
  useEffect(() => {
    const handleCatalogChange = (event: CustomEvent) => {
      console.log("CatalogContext: Received catalog change event", event.detail)
      // Invalidate all related queries
      if (typeof window !== 'undefined' && window.queryClient) {
        window.queryClient.invalidateQueries({ queryKey: ['combos'] })
        window.queryClient.invalidateQueries({ queryKey: ['catalog'] }) // Invalidate catalog instead of products
        window.queryClient.invalidateQueries({ queryKey: ['categories'] })
      }
    }

    window.addEventListener('catalogChanged', handleCatalogChange as EventListener)
    return () => window.removeEventListener('catalogChanged', handleCatalogChange as EventListener)
  }, [])

  const value: CatalogContextType = {
    selectedCatalog,
    selectedCategory,
    selectedCategoryId,
    catalogData: catalogData || null,
    isLoading,
    locationId,
    categories,
    products,
    filteredProducts,
    updateCatalog,
    updateCategory,
    resetCatalog
  }

  return (
    <CatalogContext.Provider value={value}>
      {children}
    </CatalogContext.Provider>
  )
}
