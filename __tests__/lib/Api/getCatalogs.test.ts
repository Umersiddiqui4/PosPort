import { getCatalogs } from '@/lib/Api/getCatalogs'
import api from '@/utils/axios'

// Mock axios
jest.mock('@/utils/axios')
const mockApi = api as jest.Mocked<typeof api>

describe('getCatalogs', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should fetch catalogs successfully', async () => {
    const mockCatalogs = [
      {
        id: '1',
        name: 'Catalog 1',
        description: 'Test catalog 1',
        companyId: 'company-1',
        locationId: 'location-1',
        status: 'active' as const,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      }
    ]

    const mockResponse = {
      items: mockCatalogs,
      meta: {
        page: 1,
        take: 9,
        total: 2,
        totalPages: 1
      }
    }

    mockApi.get.mockResolvedValue({ data: mockResponse })

    const result = await getCatalogs(1, 9, 'test')

    expect(mockApi.get).toHaveBeenCalledWith('/catalogs', {
      params: {
        page: 1,
        take: 9,
        q: 'test'
      }
    })
    expect(result).toEqual(mockResponse)
  })

  it('should handle API errors', async () => {
    const mockError = new Error('Failed to fetch catalogs')
    mockApi.get.mockRejectedValue(mockError)

    await expect(getCatalogs(1, 9, 'test')).rejects.toThrow('Failed to fetch catalogs')
  })

  it('should handle empty response', async () => {
    const mockResponse = {
      items: [],
      meta: {
        page: 1,
        take: 9,
        total: 0,
        totalPages: 0
      }
    }

    mockApi.get.mockResolvedValue({ data: mockResponse })

    const result = await getCatalogs(1, 9)

    expect(result).toEqual(mockResponse)
    expect(result.items).toEqual([])
  })
})
