import { updateProduct } from '@/lib/Api/updateProduct'
import { axiosInstance } from '@/utils/axios'

jest.mock('@/utils/axios', () => ({ axiosInstance: { put: jest.fn() } }))
const mockAxiosInstance = axiosInstance as jest.Mocked<typeof axiosInstance>

describe('updateProduct', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should update product successfully', async () => {
    const productData = {
      name: 'Updated Product',
      description: 'Updated Description',
      retailPrice: 150,
      cost: 120,
      status: 'active' as const,
    }
    const mockResponse = {
      data: {
        data: { id: '1', ...productData },
        message: 'Product updated successfully',
        status: 200,
      },
    }
    mockAxiosInstance.put.mockResolvedValue(mockResponse)

    const result = await updateProduct('1', productData)

    expect(result).toEqual({
      data: { id: '1', ...productData },
      message: 'Product updated successfully',
      status: 200,
    })
    expect(mockAxiosInstance.put).toHaveBeenCalledWith('/products/1', productData)
  })

  it('should handle API errors', async () => {
    const productData = {
      name: 'Updated Product',
      description: 'Updated Description',
      retailPrice: 150,
      cost: 120,
      status: 'active' as const,
    }
    const mockError = {
      response: {
        data: { message: 'Product not found', status: 404 },
        status: 404,
      },
    }
    mockAxiosInstance.put.mockRejectedValue(mockError)

    await expect(updateProduct('1', productData)).rejects.toThrow('Product not found')
    expect(mockAxiosInstance.put).toHaveBeenCalledWith('/products/1', productData)
  })

  it('should handle network errors', async () => {
    const productData = {
      name: 'Updated Product',
      description: 'Updated Description',
      retailPrice: 150,
      cost: 120,
      status: 'active' as const,
    }
    const mockError = new Error('Network error')
    mockAxiosInstance.put.mockRejectedValue(mockError)

    await expect(updateProduct('1', productData)).rejects.toThrow('Network error')
    expect(mockAxiosInstance.put).toHaveBeenCalledWith('/products/1', productData)
  })

  it('should handle validation errors', async () => {
    const productData = {
      name: '',
      description: 'Updated Description',
      retailPrice: -10,
      cost: 120,
      status: 'active' as const,
    }
    const mockError = {
      response: {
        data: { message: 'Validation failed', status: 400 },
        status: 400,
      },
    }
    mockAxiosInstance.put.mockRejectedValue(mockError)

    await expect(updateProduct('1', productData)).rejects.toThrow('Validation failed')
    expect(mockAxiosInstance.put).toHaveBeenCalledWith('/products/1', productData)
  })

  it('should handle duplicate product name error', async () => {
    const productData = {
      name: 'Existing Product',
      description: 'Updated Description',
      retailPrice: 150,
      cost: 120,
      status: 'active' as const,
    }
    const mockError = {
      response: {
        data: { message: 'Product name already exists', status: 409 },
        status: 409,
      },
    }
    mockAxiosInstance.put.mockRejectedValue(mockError)

    await expect(updateProduct('1', productData)).rejects.toThrow('Product name already exists')
    expect(mockAxiosInstance.put).toHaveBeenCalledWith('/products/1', productData)
  })

  it('should handle server errors', async () => {
    const productData = {
      name: 'Updated Product',
      description: 'Updated Description',
      retailPrice: 150,
      cost: 120,
      status: 'active' as const,
    }
    const mockError = {
      response: {
        data: { message: 'Internal server error', status: 500 },
        status: 500,
      },
    }
    mockAxiosInstance.put.mockRejectedValue(mockError)

    await expect(updateProduct('1', productData)).rejects.toThrow('Internal server error')
    expect(mockAxiosInstance.put).toHaveBeenCalledWith('/products/1', productData)
  })

  it('should handle axios error without response', async () => {
    const productData = {
      name: 'Updated Product',
      description: 'Updated Description',
      retailPrice: 150,
      cost: 120,
      status: 'active' as const,
    }
    const mockError = new Error('Request timeout')
    mockAxiosInstance.put.mockRejectedValue(mockError)

    await expect(updateProduct('1', productData)).rejects.toThrow('Request timeout')
    expect(mockAxiosInstance.put).toHaveBeenCalledWith('/products/1', productData)
  })

  it('should handle API response with error status', async () => {
    const productData = {
      name: 'Updated Product',
      description: 'Updated Description',
      retailPrice: 150,
      cost: 120,
      status: 'active' as const,
    }
    const mockResponse = {
      data: {
        message: 'Product update failed',
        status: 400,
      },
    }
    mockAxiosInstance.put.mockResolvedValue(mockResponse)

    await expect(updateProduct('1', productData)).rejects.toThrow('Product update failed')
    expect(mockAxiosInstance.put).toHaveBeenCalledWith('/products/1', productData)
  })

  it('should handle API response with no data', async () => {
    const productData = {
      name: 'Updated Product',
      description: 'Updated Description',
      retailPrice: 150,
      cost: 120,
      status: 'active' as const,
    }
    const mockResponse = {
      data: null,
    }
    mockAxiosInstance.put.mockResolvedValue(mockResponse)

    await expect(updateProduct('1', productData)).rejects.toThrow('Invalid response format')
    expect(mockAxiosInstance.put).toHaveBeenCalledWith('/products/1', productData)
  })

  it('should handle empty product id', async () => {
    const productData = {
      name: 'Updated Product',
      description: 'Updated Description',
      retailPrice: 150,
      cost: 120,
      status: 'active' as const,
    }

    await expect(updateProduct('', productData)).rejects.toThrow('Product ID is required')
    expect(mockAxiosInstance.put).not.toHaveBeenCalled()
  })

  it('should handle null product id', async () => {
    const productData = {
      name: 'Updated Product',
      description: 'Updated Description',
      retailPrice: 150,
      cost: 120,
      status: 'active' as const,
    }

    await expect(updateProduct(null as any, productData)).rejects.toThrow('Product ID is required')
    expect(mockAxiosInstance.put).not.toHaveBeenCalled()
  })

  it('should handle undefined product id', async () => {
    const productData = {
      name: 'Updated Product',
      description: 'Updated Description',
      retailPrice: 150,
      cost: 120,
      status: 'active' as const,
    }

    await expect(updateProduct(undefined as any, productData)).rejects.toThrow('Product ID is required')
    expect(mockAxiosInstance.put).not.toHaveBeenCalled()
  })

  it('should validate product data structure', async () => {
    const invalidProductData = {
      name: 'Updated Product',
      // Missing required fields
    } as any

    await expect(updateProduct('1', invalidProductData)).rejects.toThrow('Invalid product data')
    expect(mockAxiosInstance.put).not.toHaveBeenCalled()
  })

  it('should handle partial product updates', async () => {
    const partialProductData = {
      name: 'Updated Product',
      retailPrice: 150,
    }
    const mockResponse = {
      data: {
        data: { id: '1', ...partialProductData },
        message: 'Product updated successfully',
        status: 200,
      },
    }
    mockAxiosInstance.put.mockResolvedValue(mockResponse)

    const result = await updateProduct('1', partialProductData)

    expect(result).toEqual({
      data: { id: '1', ...partialProductData },
      message: 'Product updated successfully',
      status: 200,
    })
    expect(mockAxiosInstance.put).toHaveBeenCalledWith('/products/1', partialProductData)
  })

  it('should handle price validation', async () => {
    const productData = {
      name: 'Updated Product',
      description: 'Updated Description',
      retailPrice: -50,
      cost: 120,
      status: 'active' as const,
    }

    await expect(updateProduct('1', productData)).rejects.toThrow('Invalid price value')
    expect(mockAxiosInstance.put).not.toHaveBeenCalled()
  })

  it('should handle status validation', async () => {
    const productData = {
      name: 'Updated Product',
      description: 'Updated Description',
      retailPrice: 150,
      cost: 120,
      status: 'invalid' as any,
    }

    await expect(updateProduct('1', productData)).rejects.toThrow('Invalid status value')
    expect(mockAxiosInstance.put).not.toHaveBeenCalled()
  })
})

