import { renderHook, waitFor } from '@testing-library/react'
import { useProductById } from '@/hooks/use-product-by-id'
import { getProductById } from '@/lib/Api/getProductById'

// Mock the API function
jest.mock('@/lib/Api/getProductById')

const mockGetProductById = getProductById as jest.MockedFunction<typeof getProductById>

describe('useProductById', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should fetch product by id successfully', async () => {
    const mockProduct = {
      id: '1',
      name: 'Test Product',
      description: 'Test Description',
      retailPrice: 100,
      cost: 80,
      status: 'active',
      locationId: 'loc-1',
      companyId: 'comp-1',
      catalogId: 'cat-1',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      attachments: [],
    }

    mockGetProductById.mockResolvedValue({
      data: mockProduct,
      message: 'Product fetched successfully',
      status: 200,
    })

    const { result } = renderHook(() => useProductById('1'))

    await waitFor(() => {
      expect(result.current.data).toEqual(mockProduct)
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
    })

    expect(mockGetProductById).toHaveBeenCalledWith('1')
  })

  it('should handle loading state', () => {
    mockGetProductById.mockImplementation(() => new Promise(() => {}))

    const { result } = renderHook(() => useProductById('1'))

    expect(result.current.isLoading).toBe(true)
    expect(result.current.data).toBeNull()
    expect(result.current.error).toBeNull()
  })

  it('should handle error state', async () => {
    const errorMessage = 'Failed to fetch product'
    mockGetProductById.mockRejectedValue(new Error(errorMessage))

    const { result } = renderHook(() => useProductById('1'))

    await waitFor(() => {
      expect(result.current.error).toBeTruthy()
      expect(result.current.isLoading).toBe(false)
      expect(result.current.data).toBeNull()
    })
  })

  it('should handle empty product id', () => {
    const { result } = renderHook(() => useProductById(''))

    expect(result.current.data).toBeNull()
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
    expect(mockGetProductById).not.toHaveBeenCalled()
  })

  it('should handle null product id', () => {
    const { result } = renderHook(() => useProductById(null as any))

    expect(result.current.data).toBeNull()
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
    expect(mockGetProductById).not.toHaveBeenCalled()
  })

  it('should handle undefined product id', () => {
    const { result } = renderHook(() => useProductById(undefined as any))

    expect(result.current.data).toBeNull()
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
    expect(mockGetProductById).not.toHaveBeenCalled()
  })

  it('should refetch when product id changes', async () => {
    const mockProduct1 = {
      id: '1',
      name: 'Product 1',
      retailPrice: 100,
      status: 'active',
    }

    const mockProduct2 = {
      id: '2',
      name: 'Product 2',
      retailPrice: 200,
      status: 'inactive',
    }

    mockGetProductById
      .mockResolvedValueOnce({
        data: mockProduct1,
        message: 'Product 1 fetched successfully',
        status: 200,
      })
      .mockResolvedValueOnce({
        data: mockProduct2,
        message: 'Product 2 fetched successfully',
        status: 200,
      })

    const { result, rerender } = renderHook(({ id }) => useProductById(id), {
      initialProps: { id: '1' },
    })

    await waitFor(() => {
      expect(result.current.data).toEqual(mockProduct1)
    })

    rerender({ id: '2' })

    await waitFor(() => {
      expect(result.current.data).toEqual(mockProduct2)
    })

    expect(mockGetProductById).toHaveBeenCalledTimes(2)
    expect(mockGetProductById).toHaveBeenCalledWith('1')
    expect(mockGetProductById).toHaveBeenCalledWith('2')
  })

  it('should handle API response with error status', async () => {
    mockGetProductById.mockResolvedValue({
      data: null,
      message: 'Product not found',
      status: 404,
    })

    const { result } = renderHook(() => useProductById('999'))

    await waitFor(() => {
      expect(result.current.data).toBeNull()
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeTruthy()
    })
  })

  it('should handle network errors', async () => {
    mockGetProductById.mockRejectedValue({
      message: 'Network error',
      status: 500,
    })

    const { result } = renderHook(() => useProductById('1'))

    await waitFor(() => {
      expect(result.current.error).toBeTruthy()
      expect(result.current.isLoading).toBe(false)
      expect(result.current.data).toBeNull()
    })
  })
})

