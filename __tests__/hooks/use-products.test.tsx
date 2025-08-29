import React from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useProducts } from '@/hooks/use-products'
import { getProducts } from '@/lib/Api/getProducts'

jest.mock('@/lib/Api/getProducts')
const mockGetProducts = getProducts as jest.MockedFunction<typeof getProducts>

// Create a wrapper component with QueryClient provider
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

describe('useProducts', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should fetch products successfully', async () => {
    const mockProducts = [
      {
        id: '1',
        name: 'Test Product 1',
        description: 'Test Description 1',
        retailPrice: 100,
        cost: 80,
        status: 'active' as const,
        attachments: [],
      },
      {
        id: '2',
        name: 'Test Product 2',
        description: 'Test Description 2',
        retailPrice: 200,
        cost: 160,
        status: 'inactive' as const,
        attachments: [],
      },
    ]
    mockGetProducts.mockResolvedValue(mockProducts)

    const { result } = renderHook(() => useProducts(1, 10), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.products).toEqual(mockProducts)
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
    })
    expect(mockGetProducts).toHaveBeenCalledWith(1, 10, undefined)
  })

  it('should handle loading state', async () => {
    mockGetProducts.mockImplementation(() => new Promise(() => {}))

    const { result } = renderHook(() => useProducts(1, 10), {
      wrapper: createWrapper(),
    })

    expect(result.current.isLoading).toBe(true)
    expect(result.current.products).toEqual([])
    expect(result.current.error).toBeNull()
  })

  it('should handle error state', async () => {
    const mockError = new Error('Failed to fetch products')
    mockGetProducts.mockRejectedValue(mockError)

    const { result } = renderHook(() => useProducts(1, 10), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.error).toBe(mockError)
      expect(result.current.isLoading).toBe(false)
      expect(result.current.products).toEqual([])
    })
  })

  it('should handle empty/null/undefined parameters', async () => {
    const mockProducts = []
    mockGetProducts.mockResolvedValue(mockProducts)

    const { result } = renderHook(() => useProducts(0, 0), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.products).toEqual(mockProducts)
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
    })
    expect(mockGetProducts).toHaveBeenCalledWith(0, 0, undefined)
  })

  it('should refetch when parameters change', async () => {
    const mockProducts = []
    mockGetProducts.mockResolvedValue(mockProducts)

    const { rerender } = renderHook(({ page, take }) => useProducts(page, take), {
      wrapper: createWrapper(),
      initialProps: { page: 1, take: 10 },
    })

    await waitFor(() => {
      expect(mockGetProducts).toHaveBeenCalledWith(1, 10, undefined)
    })

    rerender({ page: 2, take: 20 })

    await waitFor(() => {
      expect(mockGetProducts).toHaveBeenCalledWith(2, 20, undefined)
    })
  })

  it('should handle API error status', async () => {
    const mockError = new Error('API Error')
    mockGetProducts.mockRejectedValue(mockError)

    const { result } = renderHook(() => useProducts(1, 10), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.error).toBe(mockError)
      expect(result.current.isLoading).toBe(false)
      expect(result.current.products).toEqual([])
    })
  })

  it('should handle network errors', async () => {
    const mockError = new Error('Network Error')
    mockGetProducts.mockRejectedValue(mockError)

    const { result } = renderHook(() => useProducts(1, 10), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.error).toBe(mockError)
      expect(result.current.isLoading).toBe(false)
      expect(result.current.products).toEqual([])
    })
  })

  it('should handle null data response', async () => {
    const mockProducts = null
    mockGetProducts.mockResolvedValue(mockProducts)

    const { result } = renderHook(() => useProducts(1, 10), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.products).toEqual(null)
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
    })
  })

  it('should handle empty array response', async () => {
    const mockProducts = []
    mockGetProducts.mockResolvedValue(mockProducts)

    const { result } = renderHook(() => useProducts(1, 10), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.products).toEqual([])
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
    })
  })

  it('should handle pagination correctly', async () => {
    const mockProducts = Array.from({ length: 20 }, (_, i) => ({
      id: `${i + 1}`,
      name: `Product ${i + 1}`,
      description: `Description ${i + 1}`,
      retailPrice: 100 + i,
      cost: 80 + i,
      status: 'active' as const,
      attachments: [],
    }))
    mockGetProducts.mockResolvedValue(mockProducts)

    const { result } = renderHook(() => useProducts(2, 10), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.products).toEqual(mockProducts)
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
    })
    expect(mockGetProducts).toHaveBeenCalledWith(2, 10, undefined)
  })

  it('should handle location filtering', async () => {
    const mockProducts = [
      {
        id: '1',
        name: 'Test Product',
        description: 'Test Description',
        retailPrice: 100,
        cost: 80,
        status: 'active' as const,
        attachments: [],
      },
    ]
    mockGetProducts.mockResolvedValue(mockProducts)

    const { result } = renderHook(() => useProducts(1, 10, 'loc-123'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.products).toEqual(mockProducts)
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
    })
    expect(mockGetProducts).toHaveBeenCalledWith(1, 10, 'loc-123')
  })

  it('should handle large limit values', async () => {
    const mockProducts = Array.from({ length: 100 }, (_, i) => ({
      id: `${i + 1}`,
      name: `Product ${i + 1}`,
      description: `Description ${i + 1}`,
      retailPrice: 100 + i,
      cost: 80 + i,
      status: 'active' as const,
      attachments: [],
    }))
    mockGetProducts.mockResolvedValue(mockProducts)

    const { result } = renderHook(() => useProducts(1, 100), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.products).toEqual(mockProducts)
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
    })
    expect(mockGetProducts).toHaveBeenCalledWith(1, 100, undefined)
  })

  it('should handle zero page number', async () => {
    const mockProducts = []
    mockGetProducts.mockResolvedValue(mockProducts)

    const { result } = renderHook(() => useProducts(0, 10), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.products).toEqual([])
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
    })
    expect(mockGetProducts).toHaveBeenCalledWith(0, 10, undefined)
  })

  it('should handle negative page number', async () => {
    const mockProducts = []
    mockGetProducts.mockResolvedValue(mockProducts)

    const { result } = renderHook(() => useProducts(-1, 10), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.products).toEqual([])
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
    })
    expect(mockGetProducts).toHaveBeenCalledWith(-1, 10, undefined)
  })

  it('should handle axios error without response', async () => {
    const mockError = new Error('Request timeout')
    mockGetProducts.mockRejectedValue(mockError)

    const { result } = renderHook(() => useProducts(1, 10), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.error).toBe(mockError)
      expect(result.current.isLoading).toBe(false)
      expect(result.current.products).toEqual([])
    })
  })

  it('should handle API response with error status', async () => {
    const mockError = new Error('API Error')
    mockGetProducts.mockRejectedValue(mockError)

    const { result } = renderHook(() => useProducts(1, 10), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.error).toBe(mockError)
      expect(result.current.isLoading).toBe(false)
      expect(result.current.products).toEqual([])
    })
  })

  it('should handle malformed response data', async () => {
    const mockError = new Error('Invalid response format')
    mockGetProducts.mockRejectedValue(mockError)

    const { result } = renderHook(() => useProducts(1, 10), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.error).toBe(mockError)
      expect(result.current.isLoading).toBe(false)
      expect(result.current.products).toEqual([])
    })
  })
})
