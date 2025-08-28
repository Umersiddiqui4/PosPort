import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'

export const useCatalogChangeListener = () => {
  const queryClient = useQueryClient()

  useEffect(() => {
    const handleCatalogChange = (event: CustomEvent) => {
      console.log('Catalog change listener: Invalidating queries', event.detail)
      
      // Invalidate all related queries immediately
      queryClient.invalidateQueries({ queryKey: ['combos'] })
      queryClient.invalidateQueries({ queryKey: ['catalog'] }) // Invalidate catalog instead of products
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['catalogs'] })
      
      // Force refetch critical data
      queryClient.refetchQueries({ queryKey: ['combos'] })
      queryClient.refetchQueries({ queryKey: ['catalog'] }) // Refetch catalog instead of products
    }

    // Add event listener for catalog changes only
    window.addEventListener('catalogChanged', handleCatalogChange as EventListener)

    // Cleanup
    return () => {
      window.removeEventListener('catalogChanged', handleCatalogChange as EventListener)
    }
  }, [queryClient])
}
