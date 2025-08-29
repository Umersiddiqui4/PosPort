import { renderHook, waitFor } from '@testing-library/react'
import { useProductInventory } from '@/hooks/use-product-inventory'
import { productInventory } from '@/lib/Api/productInventory'

// Mock the API function
jest.mock('@/lib/Api/productInventory')

const mockProductInventory = productInventory as jest.MockedFunction<typeof productInventory>

describe('useProductInventory', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should fetch inventory successfully', async () => {
    const mockInventory = {
      id: 'inventory-1',
      productId: '1',
      currentStock: 50,
      reservedStock: 10,
      reorderLevel: 20,
      minimumReorderQuantity: 25,
      maxStockCapacity: 100,
      costPerUnit: 80,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    }

    mockProductInventory.mockResolvedValue({
      data: mockInventory,
      message: 'Inventory fetched successfully',
      status: 200,
    })

    const { result } = renderHook(() => useProductInventory('1'))

    await waitFor(() => {
      expect(result.current.inventory).toEqual(mockInventory)
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
    })

    expect(mockProductInventory).toHaveBeenCalledWith('1')
  })

  it('should handle loading state', () => {
    mockProductInventory.mockImplementation(() => new Promise(() => {}))

    const { result } = renderHook(() => useProductInventory('1'))

    expect(result.current.isLoading).toBe(true)
    expect(result.current.inventory).toBeNull()
    expect(result.current.error).toBeNull()
  })

  it('should handle error state', async () => {
    const errorMessage = 'Failed to fetch inventory'
    mockProductInventory.mockRejectedValue(new Error(errorMessage))

    const { result } = renderHook(() => useProductInventory('1'))

    await waitFor(() => {
      expect(result.current.error).toBeTruthy()
      expect(result.current.isLoading).toBe(false)
      expect(result.current.inventory).toBeNull()
    })
  })

  it('should handle empty product id', () => {
    const { result } = renderHook(() => useProductInventory(''))

    expect(result.current.inventory).toBeNull()
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
    expect(mockProductInventory).not.toHaveBeenCalled()
  })

  it('should handle null product id', () => {
    const { result } = renderHook(() => useProductInventory(null as any))

    expect(result.current.inventory).toBeNull()
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
    expect(mockProductInventory).not.toHaveBeenCalled()
  })

  it('should handle undefined product id', () => {
    const { result } = renderHook(() => useProductInventory(undefined as any))

    expect(result.current.inventory).toBeNull()
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
    expect(mockProductInventory).not.toHaveBeenCalled()
  })

  it('should refetch when product id changes', async () => {
    const mockInventory1 = {
      id: 'inventory-1',
      productId: '1',
      currentStock: 50,
      reservedStock: 10,
      reorderLevel: 20,
      minimumReorderQuantity: 25,
      maxStockCapacity: 100,
      costPerUnit: 80,
    }

    const mockInventory2 = {
      id: 'inventory-2',
      productId: '2',
      currentStock: 100,
      reservedStock: 20,
      reorderLevel: 30,
      minimumReorderQuantity: 50,
      maxStockCapacity: 200,
      costPerUnit: 120,
    }

    mockProductInventory
      .mockResolvedValueOnce({
        data: mockInventory1,
        message: 'Inventory 1 fetched successfully',
        status: 200,
      })
      .mockResolvedValueOnce({
        data: mockInventory2,
        message: 'Inventory 2 fetched successfully',
        status: 200,
      })

    const { result, rerender } = renderHook(({ id }) => useProductInventory(id), {
      initialProps: { id: '1' },
    })

    await waitFor(() => {
      expect(result.current.inventory).toEqual(mockInventory1)
    })

    rerender({ id: '2' })

    await waitFor(() => {
      expect(result.current.inventory).toEqual(mockInventory2)
    })

    expect(mockProductInventory).toHaveBeenCalledTimes(2)
    expect(mockProductInventory).toHaveBeenCalledWith('1')
    expect(mockProductInventory).toHaveBeenCalledWith('2')
  })

  it('should handle API response with error status', async () => {
    mockProductInventory.mockResolvedValue({
      data: null,
      message: 'Inventory not found',
      status: 404,
    })

    const { result } = renderHook(() => useProductInventory('999'))

    await waitFor(() => {
      expect(result.current.inventory).toBeNull()
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeTruthy()
    })
  })

  it('should handle network errors', async () => {
    mockProductInventory.mockRejectedValue({
      message: 'Network error',
      status: 500,
    })

    const { result } = renderHook(() => useProductInventory('1'))

    await waitFor(() => {
      expect(result.current.error).toBeTruthy()
      expect(result.current.isLoading).toBe(false)
      expect(result.current.inventory).toBeNull()
    })
  })

  it('should handle API response with null data', async () => {
    mockProductInventory.mockResolvedValue({
      data: null,
      message: 'No inventory found',
      status: 200,
    })

    const { result } = renderHook(() => useProductInventory('1'))

    await waitFor(() => {
      expect(result.current.inventory).toBeNull()
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
    })
  })
})

