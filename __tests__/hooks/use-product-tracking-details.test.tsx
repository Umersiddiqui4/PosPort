import { renderHook, waitFor } from '@testing-library/react'
import { useProductTrackingDetails } from '@/hooks/use-product-tracking-details'
import { productTrackingDetails } from '@/lib/Api/productTrackingDetails'

// Mock the API function
jest.mock('@/lib/Api/productTrackingDetails')

const mockProductTrackingDetails = productTrackingDetails as jest.MockedFunction<typeof productTrackingDetails>

describe('useProductTrackingDetails', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should fetch tracking details successfully', async () => {
    const mockTrackingDetails = {
      id: 'tracking-1',
      productId: '1',
      barCode: '123456789',
      sku: 'SKU123',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    }

    mockProductTrackingDetails.mockResolvedValue({
      data: mockTrackingDetails,
      message: 'Tracking details fetched successfully',
      status: 200,
    })

    const { result } = renderHook(() => useProductTrackingDetails('1'))

    await waitFor(() => {
      expect(result.current.trackingDetails).toEqual(mockTrackingDetails)
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
    })

    expect(mockProductTrackingDetails).toHaveBeenCalledWith('1')
  })

  it('should handle loading state', () => {
    mockProductTrackingDetails.mockImplementation(() => new Promise(() => {}))

    const { result } = renderHook(() => useProductTrackingDetails('1'))

    expect(result.current.isLoading).toBe(true)
    expect(result.current.trackingDetails).toBeNull()
    expect(result.current.error).toBeNull()
  })

  it('should handle error state', async () => {
    const errorMessage = 'Failed to fetch tracking details'
    mockProductTrackingDetails.mockRejectedValue(new Error(errorMessage))

    const { result } = renderHook(() => useProductTrackingDetails('1'))

    await waitFor(() => {
      expect(result.current.error).toBeTruthy()
      expect(result.current.isLoading).toBe(false)
      expect(result.current.trackingDetails).toBeNull()
    })
  })

  it('should handle empty product id', () => {
    const { result } = renderHook(() => useProductTrackingDetails(''))

    expect(result.current.trackingDetails).toBeNull()
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
    expect(mockProductTrackingDetails).not.toHaveBeenCalled()
  })

  it('should handle null product id', () => {
    const { result } = renderHook(() => useProductTrackingDetails(null as any))

    expect(result.current.trackingDetails).toBeNull()
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
    expect(mockProductTrackingDetails).not.toHaveBeenCalled()
  })

  it('should handle undefined product id', () => {
    const { result } = renderHook(() => useProductTrackingDetails(undefined as any))

    expect(result.current.trackingDetails).toBeNull()
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
    expect(mockProductTrackingDetails).not.toHaveBeenCalled()
  })

  it('should refetch when product id changes', async () => {
    const mockTrackingDetails1 = {
      id: 'tracking-1',
      productId: '1',
      barCode: '123456789',
      sku: 'SKU123',
    }

    const mockTrackingDetails2 = {
      id: 'tracking-2',
      productId: '2',
      barCode: '987654321',
      sku: 'SKU456',
    }

    mockProductTrackingDetails
      .mockResolvedValueOnce({
        data: mockTrackingDetails1,
        message: 'Tracking details 1 fetched successfully',
        status: 200,
      })
      .mockResolvedValueOnce({
        data: mockTrackingDetails2,
        message: 'Tracking details 2 fetched successfully',
        status: 200,
      })

    const { result, rerender } = renderHook(({ id }) => useProductTrackingDetails(id), {
      initialProps: { id: '1' },
    })

    await waitFor(() => {
      expect(result.current.trackingDetails).toEqual(mockTrackingDetails1)
    })

    rerender({ id: '2' })

    await waitFor(() => {
      expect(result.current.trackingDetails).toEqual(mockTrackingDetails2)
    })

    expect(mockProductTrackingDetails).toHaveBeenCalledTimes(2)
    expect(mockProductTrackingDetails).toHaveBeenCalledWith('1')
    expect(mockProductTrackingDetails).toHaveBeenCalledWith('2')
  })

  it('should handle API response with error status', async () => {
    mockProductTrackingDetails.mockResolvedValue({
      data: null,
      message: 'Tracking details not found',
      status: 404,
    })

    const { result } = renderHook(() => useProductTrackingDetails('999'))

    await waitFor(() => {
      expect(result.current.trackingDetails).toBeNull()
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeTruthy()
    })
  })

  it('should handle network errors', async () => {
    mockProductTrackingDetails.mockRejectedValue({
      message: 'Network error',
      status: 500,
    })

    const { result } = renderHook(() => useProductTrackingDetails('1'))

    await waitFor(() => {
      expect(result.current.error).toBeTruthy()
      expect(result.current.isLoading).toBe(false)
      expect(result.current.trackingDetails).toBeNull()
    })
  })

  it('should handle API response with null data', async () => {
    mockProductTrackingDetails.mockResolvedValue({
      data: null,
      message: 'No tracking details found',
      status: 200,
    })

    const { result } = renderHook(() => useProductTrackingDetails('1'))

    await waitFor(() => {
      expect(result.current.trackingDetails).toBeNull()
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
    })
  })
})

