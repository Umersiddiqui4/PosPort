import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useLogin } from '@/hooks/useLogin'
import { loginUser } from '@/lib/Api/auth/loginUser'
import { useUserDataStore } from '@/lib/store'
import { tokenManager } from '@/lib/auth/tokenManager'

// Mock dependencies
jest.mock('@/lib/Api/auth/loginUser')
jest.mock('@/lib/store')
jest.mock('@/lib/auth/tokenManager')
jest.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn()
  })
}))

const mockLoginUser = loginUser as jest.MockedFunction<typeof loginUser>
const mockUseUserDataStore = useUserDataStore as jest.MockedFunction<typeof useUserDataStore>
const mockTokenManager = tokenManager as jest.Mocked<typeof tokenManager>

describe('useLogin', () => {
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

    // Reset mocks
    jest.clearAllMocks()
    
    // Mock store
    const mockLogin = jest.fn()
    mockUseUserDataStore.mockReturnValue(mockLogin)
    
    // Mock token manager
    mockTokenManager.setTokens = jest.fn()
    mockTokenManager.setUserData = jest.fn()
  })

  it('should handle successful login', async () => {
    const mockResponse = {
      data: {
        user: {
          id: '1',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          role: 'COMPANY_OWNER' as const,
          isEmailVerified: true,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01'
        },
        tokens: {
          access: {
            token: 'access-token',
            expires: '15m'
          },
          refresh: {
            token: 'refresh-token',
            expires: '7d'
          }
        }
      },
      message: 'Login successful',
      status: 200
    }

    mockLoginUser.mockResolvedValue(mockResponse)

    const { result } = renderHook(() => useLogin(), { wrapper })

    const loginData = {
      email: 'test@example.com',
      password: 'password123'
    }

    result.current.mutate(loginData)

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(mockLoginUser).toHaveBeenCalledWith(loginData)
    expect(mockTokenManager.setTokens).toHaveBeenCalledWith(
      'access-token',
      'refresh-token'
    )
    expect(mockTokenManager.setUserData).toHaveBeenCalledWith(mockResponse.data.user)
  })

  it('should handle login error', async () => {
    const mockError = new Error('Invalid credentials')
    mockLoginUser.mockRejectedValue(mockError)

    const { result } = renderHook(() => useLogin(), { wrapper })

    const loginData = {
      email: 'test@example.com',
      password: 'wrongpassword'
    }

    result.current.mutate(loginData)

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(mockLoginUser).toHaveBeenCalledWith(loginData)
    expect(result.current.error).toBe(mockError)
  })

  it('should handle loading state', () => {
    const { result } = renderHook(() => useLogin(), { wrapper })

    expect(result.current.isPending).toBe(false)

    const loginData = {
      email: 'test@example.com',
      password: 'password123'
    }

    result.current.mutate(loginData)

    expect(result.current.isPending).toBe(true)
  })
})

