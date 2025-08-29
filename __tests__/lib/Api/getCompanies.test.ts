import { getCompanies } from '@/lib/Api/getCompanies'

// Mock the axios instance
jest.mock('@/utils/axios', () => ({
  default: {
    get: jest.fn(),
  },
}))

// Import the mocked module
import api from '@/utils/axios'

describe('getCompanies', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const mockCompanies = [
    {
      id: '1',
      name: 'Test Company 1',
      description: 'Test description 1',
      address: 'Test address 1',
      phone: '+1234567890',
      email: 'test1@company.com',
      status: 'ACTIVE',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
    },
    {
      id: '2',
      name: 'Test Company 2',
      description: 'Test description 2',
      address: 'Test address 2',
      phone: '+0987654321',
      email: 'test2@company.com',
      status: 'ACTIVE',
      createdAt: '2023-01-02T00:00:00Z',
      updatedAt: '2023-01-02T00:00:00Z',
    },
  ]

  it('should fetch companies successfully', async () => {
    const mockResponse = {
      data: {
        data: mockCompanies,
        message: 'Companies fetched successfully',
        status: 200,
      },
    }

    ;(api.get as jest.Mock).mockResolvedValue(mockResponse)

    const result = await getCompanies()

    expect(api.get).toHaveBeenCalledWith('/companies')
    expect(result).toEqual(mockCompanies)
  })

  it('should handle API error', async () => {
    const mockError = {
      response: {
        data: {
          message: 'Failed to fetch companies',
        },
        status: 500,
      },
    }

    ;(api.get as jest.Mock).mockRejectedValue(mockError)

    await expect(getCompanies()).rejects.toThrow('Failed to fetch companies')
  })

  it('should handle network error', async () => {
    const mockError = new Error('Network error')
    ;(api.get as jest.Mock).mockRejectedValue(mockError)

    await expect(getCompanies()).rejects.toThrow('Failed to fetch companies')
  })

  it('should handle empty response', async () => {
    const mockResponse = {
      data: {
        data: [],
        message: 'No companies found',
        status: 200,
      },
    }

    ;(api.get as jest.Mock).mockResolvedValue(mockResponse)

    const result = await getCompanies()

    expect(result).toEqual([])
  })

  it('should handle null response data', async () => {
    const mockResponse = {
      data: {
        data: null,
        message: 'No companies found',
        status: 200,
      },
    }

    ;(api.get as jest.Mock).mockResolvedValue(mockResponse)

    const result = await getCompanies()

    expect(result).toEqual([])
  })

  it('should handle unauthorized error', async () => {
    const mockError = {
      response: {
        data: {
          message: 'Unauthorized access',
        },
        status: 401,
      },
    }

    ;(api.get as jest.Mock).mockRejectedValue(mockError)

    await expect(getCompanies()).rejects.toThrow('Unauthorized access')
  })

  it('should handle forbidden error', async () => {
    const mockError = {
      response: {
        data: {
          message: 'Access forbidden',
        },
        status: 403,
      },
    }

    ;(api.get as jest.Mock).mockRejectedValue(mockError)

    await expect(getCompanies()).rejects.toThrow('Access forbidden')
  })
})
