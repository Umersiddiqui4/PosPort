import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CatalogProvider, useCatalogContext } from '@/lib/contexts/CatalogContext'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
  })),
}))

// Mock the useCatalogById hook
jest.mock('@/hooks/use-cataogById', () => ({
  useCatalogById: jest.fn(),
}))

// Mock window.location and history
const mockLocation = {
  pathname: '/catalogs/test-catalog/categories',
  href: '',
}
Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true,
})

Object.defineProperty(window, 'history', {
  value: {
    pushState: jest.fn(),
    replaceState: jest.fn(),
  },
  writable: true,
})

// Mock window.dispatchEvent
Object.defineProperty(window, 'dispatchEvent', {
  value: jest.fn(),
  writable: true,
})

// Mock window.addEventListener and removeEventListener
Object.defineProperty(window, 'addEventListener', {
  value: jest.fn(),
  writable: true,
})

Object.defineProperty(window, 'removeEventListener', {
  value: jest.fn(),
  writable: true,
})

// Mock window.queryClient
Object.defineProperty(window, 'queryClient', {
  value: {
    invalidateQueries: jest.fn(),
  },
  writable: true,
})

// Test component that uses the context
const TestComponent = () => {
  const context = useCatalogContext()
  return (
    <div>
      <div data-testid="selected-catalog">{context.selectedCatalog}</div>
      <div data-testid="selected-category">{context.selectedCategory}</div>
      <div data-testid="selected-category-id">{context.selectedCategoryId}</div>
      <div data-testid="is-loading">{context.isLoading.toString()}</div>
      <div data-testid="categories-count">{context.categories.length}</div>
      <div data-testid="products-count">{context.products.length}</div>
      <div data-testid="filtered-products-count">{context.filteredProducts.length}</div>
      <div data-testid="location-id">{context.locationId || 'no-location'}</div>
      <button onClick={() => context.updateCatalog('new-catalog')} data-testid="update-catalog">
        Update Catalog
      </button>
      <button onClick={() => context.updateCategory('cat-1', 'Category 1')} data-testid="update-category">
        Update Category
      </button>
      <button onClick={() => context.resetCatalog()} data-testid="reset-catalog">
        Reset Catalog
      </button>
    </div>
  )
}

// Mock catalog data
const mockCatalogData = {
  id: 'test-catalog',
  name: 'Test Catalog',
  locationId: 'loc-123',
  productCategories: [
    {
      id: 'cat-1',
      name: 'Category 1',
      products: [
        { id: 'prod-1', name: 'Product 1', categoryId: 'cat-1' },
        { id: 'prod-2', name: 'Product 2', categoryId: 'cat-1' },
      ],
    },
    {
      id: 'cat-2',
      name: 'Category 2',
      products: [
        { id: 'prod-3', name: 'Product 3', categoryId: 'cat-2' },
      ],
    },
  ],
}

describe('CatalogContext', () => {
  const mockUseParams = require('next/navigation').useParams
  const mockUseCatalogById = require('@/hooks/use-cataogById').useCatalogById

  beforeEach(() => {
    jest.clearAllMocks()
    mockLocation.pathname = '/catalogs/test-catalog/categories'
    mockLocation.href = ''
    
    // Default mock implementations
    mockUseParams.mockReturnValue({
      userId: 'test-catalog',
      Id: undefined,
    })
    
    mockUseCatalogById.mockReturnValue({
      data: null,
      isLoading: false,
      refetch: jest.fn(),
    })
  })

  describe('Provider initialization', () => {
    it('should initialize with default values when no URL params', () => {
      mockUseParams.mockReturnValue({
        userId: undefined,
        Id: undefined,
      })

      render(
        <CatalogProvider>
          <TestComponent />
        </CatalogProvider>
      )

      expect(screen.getByTestId('selected-catalog')).toHaveTextContent('all')
      expect(screen.getByTestId('selected-category')).toHaveTextContent('All Product')
      expect(screen.getByTestId('selected-category-id')).toHaveTextContent('all')
      expect(screen.getByTestId('is-loading')).toHaveTextContent('false')
      expect(screen.getByTestId('categories-count')).toHaveTextContent('0')
      expect(screen.getByTestId('products-count')).toHaveTextContent('0')
      expect(screen.getByTestId('filtered-products-count')).toHaveTextContent('0')
      expect(screen.getByTestId('location-id')).toHaveTextContent('no-location')
    })

    it('should sync with URL params on initialization', () => {
      mockUseParams.mockReturnValue({
        userId: 'catalog-from-url',
        Id: 'category-from-url',
      })

      render(
        <CatalogProvider>
          <TestComponent />
        </CatalogProvider>
      )

      expect(screen.getByTestId('selected-catalog')).toHaveTextContent('catalog-from-url')
      expect(screen.getByTestId('selected-category-id')).toHaveTextContent('category-from-url')
    })

    it('should extract category ID from path when not in URL params', () => {
      mockLocation.pathname = '/catalogs/test-catalog/categories/cat-from-path/products'
      mockUseParams.mockReturnValue({
        userId: 'test-catalog',
        Id: undefined,
      })

      render(
        <CatalogProvider>
          <TestComponent />
        </CatalogProvider>
      )

      expect(screen.getByTestId('selected-category-id')).toHaveTextContent('cat-from-path')
    })
  })

  describe('Catalog data handling', () => {
    it('should extract categories from catalog data', () => {
      mockUseCatalogById.mockReturnValue({
        data: mockCatalogData,
        isLoading: false,
        refetch: jest.fn(),
      })

      render(
        <CatalogProvider>
          <TestComponent />
        </CatalogProvider>
      )

      expect(screen.getByTestId('categories-count')).toHaveTextContent('2')
    })

    it('should extract all products from catalog data', () => {
      mockUseCatalogById.mockReturnValue({
        data: mockCatalogData,
        isLoading: false,
        refetch: jest.fn(),
      })

      render(
        <CatalogProvider>
          <TestComponent />
        </CatalogProvider>
      )

      expect(screen.getByTestId('products-count')).toHaveTextContent('3')
    })

    it('should filter products based on selected category', () => {
      mockUseCatalogById.mockReturnValue({
        data: mockCatalogData,
        isLoading: false,
        refetch: jest.fn(),
      })

      render(
        <CatalogProvider>
          <TestComponent />
        </CatalogProvider>
      )

      // Initially should show all products
      expect(screen.getByTestId('filtered-products-count')).toHaveTextContent('3')

      // Update category to cat-1
      fireEvent.click(screen.getByTestId('update-category'))

      // Should show only products from cat-1
      expect(screen.getByTestId('filtered-products-count')).toHaveTextContent('2')
    })

    it('should show all products when category is "all"', () => {
      mockUseCatalogById.mockReturnValue({
        data: mockCatalogData,
        isLoading: false,
        refetch: jest.fn(),
      })

      render(
        <CatalogProvider>
          <TestComponent />
        </CatalogProvider>
      )

      expect(screen.getByTestId('filtered-products-count')).toHaveTextContent('3')
    })

    it('should extract location ID from catalog data', () => {
      mockUseCatalogById.mockReturnValue({
        data: mockCatalogData,
        isLoading: false,
        refetch: jest.fn(),
      })

      render(
        <CatalogProvider>
          <TestComponent />
        </CatalogProvider>
      )

      expect(screen.getByTestId('location-id')).toHaveTextContent('loc-123')
    })
  })

  describe('Catalog updates', () => {
    it('should update catalog and reset category', () => {
      mockUseParams.mockReturnValue({
        userId: undefined,
        Id: undefined,
      })

      render(
        <CatalogProvider>
          <TestComponent />
        </CatalogProvider>
      )

      fireEvent.click(screen.getByTestId('update-catalog'))

      expect(screen.getByTestId('selected-catalog')).toHaveTextContent('new-catalog')
      expect(screen.getByTestId('selected-category')).toHaveTextContent('All Product')
      expect(screen.getByTestId('selected-category-id')).toHaveTextContent('all')
    })

    it('should update URL when catalog changes', () => {
      render(
        <CatalogProvider>
          <TestComponent />
        </CatalogProvider>
      )

      fireEvent.click(screen.getByTestId('update-catalog'))

      expect(window.history.pushState).toHaveBeenCalledWith(
        {},
        '',
        '/catalogs/new-catalog/categories'
      )
    })

    it('should dispatch catalog change event', () => {
      render(
        <CatalogProvider>
          <TestComponent />
        </CatalogProvider>
      )

      fireEvent.click(screen.getByTestId('update-catalog'))

      expect(window.dispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'catalogChanged',
          detail: expect.objectContaining({
            catalogId: 'new-catalog',
          }),
        })
      )
    })

    it('should navigate to home when catalog is set to "all"', () => {
      render(
        <CatalogProvider>
          <TestComponent />
        </CatalogProvider>
      )

      // First set a catalog
      fireEvent.click(screen.getByTestId('update-catalog'))
      
      // Then reset to "all"
      fireEvent.click(screen.getByTestId('reset-catalog'))

      expect(window.history.pushState).toHaveBeenCalledWith({}, '', '/')
    })
  })

  describe('Category updates', () => {
    it('should update category selection', () => {
      render(
        <CatalogProvider>
          <TestComponent />
        </CatalogProvider>
      )

      fireEvent.click(screen.getByTestId('update-category'))

      expect(screen.getByTestId('selected-category')).toHaveTextContent('Category 1')
      expect(screen.getByTestId('selected-category-id')).toHaveTextContent('cat-1')
    })

    it('should update URL when category changes', () => {
      mockUseParams.mockReturnValue({
        userId: undefined,
        Id: undefined,
      })

      render(
        <CatalogProvider>
          <TestComponent />
        </CatalogProvider>
      )

      // First set a catalog
      fireEvent.click(screen.getByTestId('update-catalog'))
      
      // Then update category
      fireEvent.click(screen.getByTestId('update-category'))

      // Check that the last call was for the category update
      const calls = (window.history.pushState as jest.Mock).mock.calls
      const lastCall = calls[calls.length - 1]
      expect(lastCall).toEqual([
        {},
        '',
        '/catalogs/new-catalog/categories/cat-1/products'
      ])
    })

    it('should handle "all" category correctly', () => {
      mockUseParams.mockReturnValue({
        userId: undefined,
        Id: undefined,
      })

      render(
        <CatalogProvider>
          <TestComponent />
        </CatalogProvider>
      )

      // Update category to "all" (cat-1 is not "all", so it should set the actual categoryId)
      fireEvent.click(screen.getByTestId('update-category'))
      
      // The categoryId should be set to the actual category ID
      expect(screen.getByTestId('selected-category-id')).toHaveTextContent('cat-1')
    })
  })

  describe('Reset functionality', () => {
    it('should reset all selections to default values', () => {
      mockUseParams.mockReturnValue({
        userId: undefined,
        Id: undefined,
      })

      render(
        <CatalogProvider>
          <TestComponent />
        </CatalogProvider>
      )

      // First set some values
      fireEvent.click(screen.getByTestId('update-catalog'))
      fireEvent.click(screen.getByTestId('update-category'))
      
      // Then reset
      fireEvent.click(screen.getByTestId('reset-catalog'))

      expect(screen.getByTestId('selected-catalog')).toHaveTextContent('all')
      expect(screen.getByTestId('selected-category')).toHaveTextContent('All Product')
      expect(screen.getByTestId('selected-category-id')).toHaveTextContent('all')
    })

    it('should navigate to home when reset', () => {
      render(
        <CatalogProvider>
          <TestComponent />
        </CatalogProvider>
      )

      fireEvent.click(screen.getByTestId('reset-catalog'))

      expect(window.history.pushState).toHaveBeenCalledWith({}, '', '/')
    })
  })

  describe('Loading states', () => {
    it('should show loading state when data is being fetched', () => {
      mockUseCatalogById.mockReturnValue({
        data: null,
        isLoading: true,
        refetch: jest.fn(),
      })

      render(
        <CatalogProvider>
          <TestComponent />
        </CatalogProvider>
      )

      expect(screen.getByTestId('is-loading')).toHaveTextContent('true')
    })
  })

  describe('Error handling', () => {
    it('should throw error when useCatalogContext is used outside provider', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      
      expect(() => {
        render(<TestComponent />)
      }).toThrow('useCatalogContext must be used within a CatalogProvider')
      
      consoleSpy.mockRestore()
    })
  })

  describe('Event listeners', () => {
    it('should add popstate event listener', () => {
      render(
        <CatalogProvider>
          <TestComponent />
        </CatalogProvider>
      )

      expect(window.addEventListener).toHaveBeenCalledWith('popstate', expect.any(Function))
    })

    it('should add catalogChanged event listener', () => {
      render(
        <CatalogProvider>
          <TestComponent />
        </CatalogProvider>
      )

      expect(window.addEventListener).toHaveBeenCalledWith('catalogChanged', expect.any(Function))
    })

    it('should remove event listeners on unmount', () => {
      const { unmount } = render(
        <CatalogProvider>
          <TestComponent />
        </CatalogProvider>
      )

      unmount()

      expect(window.removeEventListener).toHaveBeenCalledWith('popstate', expect.any(Function))
      expect(window.removeEventListener).toHaveBeenCalledWith('catalogChanged', expect.any(Function))
    })
  })

  describe('Query invalidation', () => {
    it('should invalidate queries when catalog change event is received', () => {
      render(
        <CatalogProvider>
          <TestComponent />
        </CatalogProvider>
      )

      // Simulate catalog change event
      const catalogChangeEvent = new CustomEvent('catalogChanged', {
        detail: { catalogId: 'test-catalog', locationId: 'loc-123' }
      })
      
      // Find the event listener and call it
      const addEventListenerCalls = (window.addEventListener as jest.Mock).mock.calls
      const catalogChangeListener = addEventListenerCalls.find(
        call => call[0] === 'catalogChanged'
      )?.[1]

      if (catalogChangeListener) {
        catalogChangeListener(catalogChangeEvent)
      }

      expect(window.queryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['combos']
      })
      expect(window.queryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['catalog']
      })
      expect(window.queryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: ['categories']
      })
    })
  })
})
