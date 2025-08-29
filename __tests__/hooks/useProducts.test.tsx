import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useProducts } from '@/hooks/use-products'
import { getProducts } from '@/lib/Api/getProducts'

// Mock dependencies
jest.mock('@/lib/Api/getProducts')
jest.mock('@/hooks/use-toast', () => ({
  toast: jest.fn()
}))

const mockGetProducts = getProducts as jest.MockedFunction<typeof getProducts>

describe('useProducts', () => {
  let queryClient: QueryClient
  let wrapper: React.FC<{ children: React.ReactNode }>

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false }
      }
    })

    wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    )

    jest.clearAllMocks()
  })

  it('should fetch products successfully', async () => {
    const mockProducts = [
      {
        id: '1',
        name: 'Product 1',
        price: 10.99,
        description: 'Test product 1',
        status: 'active' as const,
        categoryId: 'cat-1',
        companyId: 'company-1',
        locationId: 'location-1',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      },
      {
        id: '2',
        name: 'Product 2',
        price: 20.99,
        description: 'Test product 2',
        status: 'active' as const,
        categoryId: 'cat-2',
        companyId: 'company-1',
        locationId: 'location-1',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      }
    ]

    const mockResponse = {
      data: mockProducts,
      message: 'Products fetched successfully',
      status: 200
    }

    mockGetProducts.mockResolvedValue(mockResponse)

    const { result } = renderHook(() => useProducts(1, 1000, 'location-1'), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.products).toEqual(mockProducts)
    expect(result.current.error).toBeNull()
  })

  it('should handle loading state', () => {
    mockGetProducts.mockImplementation(() => new Promise(() => {}))

    const { result } = renderHook(() => useProducts(1, 1000), { wrapper })

    expect(result.current.isLoading).toBe(true)
    expect(result.current.products).toEqual([])
  })

  it('should handle error state', async () => {
    const mockError = new Error('Failed to fetch products')
    mockGetProducts.mockRejectedValue(mockError)

    const { result } = renderHook(() => useProducts(1, 1000), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.error).toBeTruthy()
    expect(result.current.products).toEqual([])
  })

  it('should call getProducts with correct parameters', async () => {
    const mockResponse = {
      data: [],
      message: 'Products fetched successfully',
      status: 200
    }

    mockGetProducts.mockResolvedValue(mockResponse)

    renderHook(() => useProducts(1, 1000, 'location-1'), { wrapper })

    await waitFor(() => {
      expect(mockGetProducts).toHaveBeenCalledWith(1, 1000, 'location-1')
    })
  })

  it('should handle empty products array', async () => {
    const mockResponse = {
      data: [],
      message: 'No products found',
      status: 200
    }

    mockGetProducts.mockResolvedValue(mockResponse)

    const { result } = renderHook(() => useProducts(1, 1000), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.products).toEqual([])
    expect(result.current.error).toBeNull()
  })
})
