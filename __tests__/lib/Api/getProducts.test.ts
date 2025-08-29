import { getProducts } from '@/lib/Api/getProducts'

// Mock the axios instance
jest.mock('@/utils/axios', () => ({
  default: {
    get: jest.fn(),
  },
}))

// Import the mocked module
import api from '@/utils/axios'

describe('getProducts', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const mockProducts = [
    {
      id: '1',
      name: 'Test Product 1',
      description: 'Test description 1',
      price: 10.99,
      status: 'ACTIVE',
      categoryId: 'cat1',
      companyId: 'comp1',
      locationId: 'loc1',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
    },
    {
      id: '2',
      name: 'Test Product 2',
      description: 'Test description 2',
      price: 15.50,
      status: 'ACTIVE',
      categoryId: 'cat2',
      companyId: 'comp2',
      locationId: 'loc2',
      createdAt: '2023-01-02T00:00:00Z',
      updatedAt: '2023-01-02T00:00:00Z',
    },
  ]

  it('should fetch products successfully', async () => {
    const mockResponse = {
      data: {
        data: mockProducts,
        message: 'Products fetched successfully',
        status: 200,
      },
    }

    ;(api.get as jest.Mock).mockResolvedValue(mockResponse)

    const result = await getProducts()

    expect(api.get).toHaveBeenCalledWith('/products')
    expect(result).toEqual(mockProducts)
  })

  it('should handle API error', async () => {
    const mockError = {
      response: {
        data: {
          message: 'Failed to fetch products',
        },
        status: 500,
      },
    }

    ;(api.get as jest.Mock).mockRejectedValue(mockError)

    await expect(getProducts()).rejects.toThrow('Failed to fetch products')
  })

  it('should handle network error', async () => {
    const mockError = new Error('Network error')
    ;(api.get as jest.Mock).mockRejectedValue(mockError)

    await expect(getProducts()).rejects.toThrow('Failed to fetch products')
  })

  it('should handle empty response', async () => {
    const mockResponse = {
      data: {
        data: [],
        message: 'No products found',
        status: 200,
      },
    }

    ;(api.get as jest.Mock).mockResolvedValue(mockResponse)

    const result = await getProducts()

    expect(result).toEqual([])
  })

  it('should handle null response data', async () => {
    const mockResponse = {
      data: {
        data: null,
        message: 'No products found',
        status: 200,
      },
    }

    ;(api.get as jest.Mock).mockResolvedValue(mockResponse)

    const result = await getProducts()

    expect(result).toEqual([])
  })
})
