import { createProduct } from '@/lib/Api/createProduct'

// Mock the axios instance
jest.doMock('@/utils/axios', () => ({
  default: {
    post: jest.fn(),
  },
}))

// Import the mocked module
import api from '@/utils/axios'

describe('createProduct', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const mockProductData = {
    productName: 'Test Product',
    description: 'A test product',
    retailPrice: 99.99,
    categoryId: '123e4567-e89b-12d3-a456-426614174000',
    companyId: '123e4567-e89b-12d3-a456-426614174001',
    locationId: '123e4567-e89b-12d3-a456-426614174002',
  }

  const mockResponse = {
    data: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Test Product',
      description: 'A test product',
      price: 99.99,
      status: 'active',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
    },
    message: 'Product created successfully',
  }

  it('should create a product successfully', async () => {
    ;(api.post as jest.Mock).mockResolvedValue({ data: mockResponse })

    const result = await createProduct(mockProductData)

    expect(api.post).toHaveBeenCalledWith('/products', mockProductData)
    expect(result).toEqual(mockResponse)
  })

  it('should handle validation errors', async () => {
    const errorResponse = {
      response: {
        data: {
          message: 'Validation failed',
          errors: {
            productName: ['Product name is required'],
            retailPrice: ['Price must be positive'],
          },
        },
      },
    }
    ;(api.post as jest.Mock).mockRejectedValue(errorResponse)

    await expect(createProduct(mockProductData)).rejects.toThrow('Validation failed')
  })

  it('should handle server errors', async () => {
    const errorResponse = {
      response: {
        data: {
          message: 'Internal server error',
        },
        status: 500,
      },
    }
    ;(api.post as jest.Mock).mockRejectedValue(errorResponse)

    await expect(createProduct(mockProductData)).rejects.toThrow('Internal server error')
  })

  it('should handle unauthorized errors', async () => {
    const errorResponse = {
      response: {
        data: {
          message: 'Unauthorized access',
        },
        status: 401,
      },
    }
    ;(api.post as jest.Mock).mockRejectedValue(errorResponse)

    await expect(createProduct(mockProductData)).rejects.toThrow('Unauthorized access')
  })

  it('should handle forbidden errors', async () => {
    const errorResponse = {
      response: {
        data: {
          message: 'Forbidden',
        },
        status: 403,
      },
    }
    ;(api.post as jest.Mock).mockRejectedValue(errorResponse)

    await expect(createProduct(mockProductData)).rejects.toThrow('Forbidden')
  })

  it('should handle network errors with generic message', async () => {
    const networkError = new Error('Network Error')
    ;(api.post as jest.Mock).mockRejectedValue(networkError)

    await expect(createProduct(mockProductData)).rejects.toThrow('Failed to create product')
  })

  it('should handle errors without response data', async () => {
    const errorWithoutData = {
      message: 'Some error',
    }
    ;(api.post as jest.Mock).mockRejectedValue(errorWithoutData)

    await expect(createProduct(mockProductData)).rejects.toThrow('Failed to create product')
  })

  it('should handle errors with empty response', async () => {
    const emptyError = {}
    ;(api.post as jest.Mock).mockRejectedValue(emptyError)

    await expect(createProduct(mockProductData)).rejects.toThrow('Failed to create product')
  })

  it('should create product with minimal required data', async () => {
    const minimalData = {
      productName: 'Minimal Product',
      retailPrice: 50.00,
      categoryId: '123e4567-e89b-12d3-a456-426614174000',
    }

    ;(api.post as jest.Mock).mockResolvedValue({ data: mockResponse })

    const result = await createProduct(minimalData)

    expect(api.post).toHaveBeenCalledWith('/products', minimalData)
    expect(result).toEqual(mockResponse)
  })

  it('should create product with all optional fields', async () => {
    const fullData = {
      ...mockProductData,
      status: 'draft' as const,
      uom: 'pieces',
      cost: 75.00,
      image: 'https://example.com/image.jpg',
    }

    ;(api.post as jest.Mock).mockResolvedValue({ data: mockResponse })

    const result = await createProduct(fullData)

    expect(api.post).toHaveBeenCalledWith('/products', fullData)
    expect(result).toEqual(mockResponse)
  })

  it('should handle different product statuses', async () => {
    const activeProduct = { ...mockProductData, status: 'active' as const }
    const inactiveProduct = { ...mockProductData, status: 'inactive' as const }
    const draftProduct = { ...mockProductData, status: 'draft' as const }

    ;(api.post as jest.Mock).mockResolvedValue({ data: mockResponse })

    await createProduct(activeProduct)
    await createProduct(inactiveProduct)
    await createProduct(draftProduct)

    expect(api.post).toHaveBeenCalledTimes(3)
    expect(api.post).toHaveBeenNthCalledWith(1, '/products', activeProduct)
    expect(api.post).toHaveBeenNthCalledWith(2, '/products', inactiveProduct)
    expect(api.post).toHaveBeenNthCalledWith(3, '/products', draftProduct)
  })
})
