"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useCatalogById } from '@/hooks/use-cataogById'

interface CatalogContextType {
  selectedCatalog: string
  selectedCategory: string
  selectedCategoryId: string
  catalogData: any
  isLoading: boolean
  locationId: string | undefined
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
  const catalogIdFromUrl = params?.userId as string
  const categoryIdFromUrl = params?.Id as string
  
  const [selectedCatalog, setSelectedCatalog] = useState<string>("all")
  const [selectedCategory, setSelectedCategory] = useState("All Product")
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all")
  
  // Fetch catalog data
  const { data: catalogData, isLoading, refetch } = useCatalogById(
    selectedCatalog !== "all" ? selectedCatalog : ""
  )
  
  // Extract locationId from catalog data
  const locationId = catalogData?.locationId

  // Update catalog selection
  const updateCatalog = useCallback((catalogId: string) => {
    const actualCatalogId = catalogId === "all" ? "" : catalogId
    console.log("CatalogContext: Updating catalog", { catalogId, actualCatalogId })
    
    setSelectedCatalog(actualCatalogId)
    setSelectedCategoryId("all") // Reset category when catalog changes
    setSelectedCategory("All Product")
    
    // Update URL
    if (actualCatalogId) {
      const newUrl = `/catalogs/${actualCatalogId}/categories`
      console.log("CatalogContext: Navigating to:", newUrl)
      
      if (typeof window !== 'undefined') {
        window.history.pushState({}, '', newUrl)
        
        // Dispatch custom event for immediate updates
        window.dispatchEvent(new CustomEvent('catalogChanged', { 
          detail: { 
            catalogId: actualCatalogId,
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
    console.log("CatalogContext: Updating category", { categoryId, actualCategoryId, categoryName })
    
    setSelectedCategoryId(actualCategoryId)
    setSelectedCategory(categoryName)
    
    // Update URL
    if (selectedCatalog && selectedCatalog !== "all") {
      if (actualCategoryId) {
        const newUrl = `/catalogs/${selectedCatalog}/categories/${actualCategoryId}/products`
        if (typeof window !== 'undefined') {
          window.history.pushState({}, '', newUrl)
          
          window.dispatchEvent(new CustomEvent('categoryChanged', { 
            detail: { 
              categoryId: actualCategoryId,
              categoryName,
              catalogId: selectedCatalog,
              locationId: catalogData?.locationId
            } 
          }))
        }
      } else {
        const newUrl = `/catalogs/${selectedCatalog}/categories`
        if (typeof window !== 'undefined') {
          window.history.pushState({}, '', newUrl)
        }
      }
    }
  }, [selectedCatalog, catalogData?.locationId])

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
    if (catalogIdFromUrl && catalogIdFromUrl !== selectedCatalog) {
      console.log("CatalogContext: Syncing with URL params", { catalogIdFromUrl, selectedCatalog })
      setSelectedCatalog(catalogIdFromUrl)
    }
    
    if (categoryIdFromUrl && categoryIdFromUrl !== selectedCategoryId) {
      console.log("CatalogContext: Syncing category with URL params", { categoryIdFromUrl, selectedCategoryId })
      setSelectedCategoryId(categoryIdFromUrl)
    }
  }, [catalogIdFromUrl, categoryIdFromUrl, selectedCatalog, selectedCategoryId])

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
        window.queryClient.invalidateQueries({ queryKey: ['products'] })
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
    catalogData,
    isLoading,
    locationId,
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
