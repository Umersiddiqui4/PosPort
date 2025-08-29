import { getProductById } from '@/lib/Api/getProductById'
import { axiosInstance } from '@/utils/axios'

// Mock axios instance
jest.mock('@/utils/axios', () => ({
  axiosInstance: {
    get: jest.fn(),
  },
}))

const mockAxiosInstance = axiosInstance as jest.Mocked<typeof axiosInstance>

describe('getProductById', () => {
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

    const mockResponse = {
      data: {
        data: mockProduct,
        message: 'Product fetched successfully',
        status: 200,
      },
    }

    mockAxiosInstance.get.mockResolvedValue(mockResponse)

    const result = await getProductById('1')

    expect(result).toEqual({
      data: mockProduct,
      message: 'Product fetched successfully',
      status: 200,
    })
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/products/1')
  })

  it('should handle API errors', async () => {
    const errorMessage = 'Product not found'
    mockAxiosInstance.get.mockRejectedValue({
      response: {
        data: {
          message: errorMessage,
          status: 404,
        },
      },
    })

    await expect(getProductById('999')).rejects.toThrow()
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/products/999')
  })

  it('should handle network errors', async () => {
    mockAxiosInstance.get.mockRejectedValue(new Error('Network error'))

    await expect(getProductById('1')).rejects.toThrow('Network error')
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/products/1')
  })

  it('should handle empty product id', async () => {
    await expect(getProductById('')).rejects.toThrow()
    expect(mockAxiosInstance.get).not.toHaveBeenCalled()
  })

  it('should handle null product id', async () => {
    await expect(getProductById(null as any)).rejects.toThrow()
    expect(mockAxiosInstance.get).not.toHaveBeenCalled()
  })

  it('should handle undefined product id', async () => {
    await expect(getProductById(undefined as any)).rejects.toThrow()
    expect(mockAxiosInstance.get).not.toHaveBeenCalled()
  })

  it('should handle API response with error status', async () => {
    const mockResponse = {
      data: {
        data: null,
        message: 'Product not found',
        status: 404,
      },
    }

    mockAxiosInstance.get.mockResolvedValue(mockResponse)

    const result = await getProductById('999')

    expect(result).toEqual({
      data: null,
      message: 'Product not found',
      status: 404,
    })
  })

  it('should handle API response without data', async () => {
    const mockResponse = {
      data: {
        message: 'Product fetched successfully',
        status: 200,
      },
    }

    mockAxiosInstance.get.mockResolvedValue(mockResponse)

    const result = await getProductById('1')

    expect(result).toEqual({
      data: undefined,
      message: 'Product fetched successfully',
      status: 200,
    })
  })

  it('should handle axios error without response', async () => {
    mockAxiosInstance.get.mockRejectedValue(new Error('Axios error'))

    await expect(getProductById('1')).rejects.toThrow('Axios error')
  })

  it('should handle axios error with response but no data', async () => {
    mockAxiosInstance.get.mockRejectedValue({
      response: {},
    })

    await expect(getProductById('1')).rejects.toThrow()
  })
})

