import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'

export const useCatalogChangeListener = () => {
  const queryClient = useQueryClient()

  useEffect(() => {
    const handleCatalogChange = (event: CustomEvent) => {
      console.log('Catalog change listener: Invalidating queries', event.detail)
      
      // Invalidate all related queries immediately
      queryClient.invalidateQueries({ queryKey: ['combos'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['catalogs'] })
      
      // Force refetch critical data
      queryClient.refetchQueries({ queryKey: ['combos'] })
      queryClient.refetchQueries({ queryKey: ['products'] })
    }

    const handleCategoryChange = (event: CustomEvent) => {
      console.log('Category change listener: Invalidating queries', event.detail)
      
      // Invalidate product-related queries when category changes
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.refetchQueries({ queryKey: ['products'] })
    }

    // Add event listeners
    window.addEventListener('catalogChanged', handleCatalogChange as EventListener)
    window.addEventListener('categoryChanged', handleCategoryChange as EventListener)

    // Cleanup
    return () => {
      window.removeEventListener('catalogChanged', handleCatalogChange as EventListener)
      window.removeEventListener('categoryChanged', handleCategoryChange as EventListener)
    }
  }, [queryClient])
}
