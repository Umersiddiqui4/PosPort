import { renderHook, waitFor } from '@testing-library/react'
import { useProductLifetimeDetails } from '@/hooks/use-product-lifetime-details'
import { productLifetimeDetails } from '@/lib/Api/productLifetimeDetails'

// Mock the API function
jest.mock('@/lib/Api/productLifetimeDetails')

const mockProductLifetimeDetails = productLifetimeDetails as jest.MockedFunction<typeof productLifetimeDetails>

describe('useProductLifetimeDetails', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should fetch lifetime details successfully', async () => {
    const mockLifetimeDetails = {
      id: 'lifetime-1',
      productId: '1',
      expiry: '2024-12-31T00:00:00Z',
      shelfLife: '12 months',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    }

    mockProductLifetimeDetails.mockResolvedValue({
      data: mockLifetimeDetails,
      message: 'Lifetime details fetched successfully',
      status: 200,
    })

    const { result } = renderHook(() => useProductLifetimeDetails('1'))

    await waitFor(() => {
      expect(result.current.lifetimeDetails).toEqual(mockLifetimeDetails)
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
    })

    expect(mockProductLifetimeDetails).toHaveBeenCalledWith('1')
  })

  it('should handle loading state', () => {
    mockProductLifetimeDetails.mockImplementation(() => new Promise(() => {}))

    const { result } = renderHook(() => useProductLifetimeDetails('1'))

    expect(result.current.isLoading).toBe(true)
    expect(result.current.lifetimeDetails).toBeNull()
    expect(result.current.error).toBeNull()
  })

  it('should handle error state', async () => {
    const errorMessage = 'Failed to fetch lifetime details'
    mockProductLifetimeDetails.mockRejectedValue(new Error(errorMessage))

    const { result } = renderHook(() => useProductLifetimeDetails('1'))

    await waitFor(() => {
      expect(result.current.error).toBeTruthy()
      expect(result.current.isLoading).toBe(false)
      expect(result.current.lifetimeDetails).toBeNull()
    })
  })

  it('should handle empty product id', () => {
    const { result } = renderHook(() => useProductLifetimeDetails(''))

    expect(result.current.lifetimeDetails).toBeNull()
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
    expect(mockProductLifetimeDetails).not.toHaveBeenCalled()
  })

  it('should handle null product id', () => {
    const { result } = renderHook(() => useProductLifetimeDetails(null as any))

    expect(result.current.lifetimeDetails).toBeNull()
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
    expect(mockProductLifetimeDetails).not.toHaveBeenCalled()
  })

  it('should handle undefined product id', () => {
    const { result } = renderHook(() => useProductLifetimeDetails(undefined as any))

    expect(result.current.lifetimeDetails).toBeNull()
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
    expect(mockProductLifetimeDetails).not.toHaveBeenCalled()
  })

  it('should refetch when product id changes', async () => {
    const mockLifetimeDetails1 = {
      id: 'lifetime-1',
      productId: '1',
      expiry: '2024-12-31T00:00:00Z',
      shelfLife: '12 months',
    }

    const mockLifetimeDetails2 = {
      id: 'lifetime-2',
      productId: '2',
      expiry: '2025-12-31T00:00:00Z',
      shelfLife: '24 months',
    }

    mockProductLifetimeDetails
      .mockResolvedValueOnce({
        data: mockLifetimeDetails1,
        message: 'Lifetime details 1 fetched successfully',
        status: 200,
      })
      .mockResolvedValueOnce({
        data: mockLifetimeDetails2,
        message: 'Lifetime details 2 fetched successfully',
        status: 200,
      })

    const { result, rerender } = renderHook(({ id }) => useProductLifetimeDetails(id), {
      initialProps: { id: '1' },
    })

    await waitFor(() => {
      expect(result.current.lifetimeDetails).toEqual(mockLifetimeDetails1)
    })

    rerender({ id: '2' })

    await waitFor(() => {
      expect(result.current.lifetimeDetails).toEqual(mockLifetimeDetails2)
    })

    expect(mockProductLifetimeDetails).toHaveBeenCalledTimes(2)
    expect(mockProductLifetimeDetails).toHaveBeenCalledWith('1')
    expect(mockProductLifetimeDetails).toHaveBeenCalledWith('2')
  })

  it('should handle API response with error status', async () => {
    mockProductLifetimeDetails.mockResolvedValue({
      data: null,
      message: 'Lifetime details not found',
      status: 404,
    })

    const { result } = renderHook(() => useProductLifetimeDetails('999'))

    await waitFor(() => {
      expect(result.current.lifetimeDetails).toBeNull()
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeTruthy()
    })
  })

  it('should handle network errors', async () => {
    mockProductLifetimeDetails.mockRejectedValue({
      message: 'Network error',
      status: 500,
    })

    const { result } = renderHook(() => useProductLifetimeDetails('1'))

    await waitFor(() => {
      expect(result.current.error).toBeTruthy()
      expect(result.current.isLoading).toBe(false)
      expect(result.current.lifetimeDetails).toBeNull()
    })
  })

  it('should handle API response with null data', async () => {
    mockProductLifetimeDetails.mockResolvedValue({
      data: null,
      message: 'No lifetime details found',
      status: 200,
    })

    const { result } = renderHook(() => useProductLifetimeDetails('1'))

    await waitFor(() => {
      expect(result.current.lifetimeDetails).toBeNull()
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
    })
  })
})

