import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useCatalogs } from '@/hooks/use-catalogs'
import { getCatalogs } from '@/lib/Api/getCatalogs'

// Mock dependencies
jest.mock('@/lib/Api/getCatalogs')
jest.mock('@/hooks/use-toast', () => ({
  toast: jest.fn()
}))

const mockGetCatalogs = getCatalogs as jest.MockedFunction<typeof getCatalogs>

describe('useCatalogs', () => {
  let queryClient: QueryClient
  let wrapper: React.FC<{ children: React.ReactNode }>

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false }
      }
    })

    wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    )

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
      },
      {
        id: '2',
        name: 'Catalog 2',
        description: 'Test catalog 2',
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

    mockGetCatalogs.mockResolvedValue(mockResponse)

    const { result } = renderHook(() => useCatalogs(1, 9, ''), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.catalogs).toEqual(mockCatalogs)
    expect(result.current.error).toBeNull()
  })

  it('should handle loading state', () => {
    mockGetCatalogs.mockImplementation(() => new Promise(() => {}))

    const { result } = renderHook(() => useCatalogs(1, 9), { wrapper })

    expect(result.current.isLoading).toBe(true)
    expect(result.current.catalogs).toEqual([])
  })

  it('should handle error state', async () => {
    const mockError = new Error('Failed to fetch catalogs')
    mockGetCatalogs.mockRejectedValue(mockError)

    const { result } = renderHook(() => useCatalogs(1, 9), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.error).toBeTruthy()
    expect(result.current.catalogs).toEqual([])
  })

  it('should call getCatalogs with correct parameters', async () => {
    const mockResponse = {
      items: [],
      meta: {
        page: 1,
        take: 9,
        total: 0,
        totalPages: 0
      }
    }

    mockGetCatalogs.mockResolvedValue(mockResponse)

    renderHook(() => useCatalogs(1, 9, 'test'), { wrapper })

    await waitFor(() => {
      expect(mockGetCatalogs).toHaveBeenCalledWith(1, 9, 'test')
    })
  })

  it('should handle empty catalogs array', async () => {
    const mockResponse = {
      items: [],
      meta: {
        page: 1,
        take: 9,
        total: 0,
        totalPages: 0
      }
    }

    mockGetCatalogs.mockResolvedValue(mockResponse)

    const { result } = renderHook(() => useCatalogs(1, 9), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.catalogs).toEqual([])
    expect(result.current.error).toBeNull()
  })
})
