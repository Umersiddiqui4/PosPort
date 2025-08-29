import { renderHook } from '@testing-library/react'
import { useLogout } from '@/hooks/useLogout'
import { useUserDataStore } from '@/lib/store'
import { tokenManager } from '@/lib/auth/tokenManager'
import axios from 'axios'

// Mock dependencies
jest.mock('@/lib/store')
jest.mock('@/lib/auth/tokenManager')
jest.mock('axios')
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn()
  })
}))

const mockUseUserDataStore = useUserDataStore as jest.MockedFunction<typeof useUserDataStore>
const mockTokenManager = tokenManager as jest.Mocked<typeof tokenManager>
const mockAxios = axios as jest.Mocked<typeof axios>

describe('useLogout', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    
    // Mock store
    const mockLogout = jest.fn()
    mockUseUserDataStore.mockReturnValue(mockLogout)
    
    // Mock token manager
    mockTokenManager.getAccessToken = jest.fn()
    mockTokenManager.clearTokens = jest.fn()
    
    // Mock axios
    mockAxios.post = jest.fn()
  })

  it('should handle successful logout', async () => {
    const mockLogout = jest.fn()
    mockUseUserDataStore.mockReturnValue(mockLogout)
    mockTokenManager.getAccessToken.mockReturnValue('test-token')
    mockAxios.post.mockResolvedValue({})

    const { result } = renderHook(() => useLogout())

    await result.current()

    expect(mockAxios.post).toHaveBeenCalledWith(
      'https://dev-api.posport.io/api/v1/auth/logout',
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-token'
        }
      }
    )
    expect(mockLogout).toHaveBeenCalled()
    expect(mockTokenManager.clearTokens).toHaveBeenCalled()
  })

  it('should handle logout with no token', async () => {
    const mockLogout = jest.fn()
    mockUseUserDataStore.mockReturnValue(mockLogout)
    mockTokenManager.getAccessToken.mockReturnValue(null)
    mockAxios.post.mockResolvedValue({})

    const { result } = renderHook(() => useLogout())

    await result.current()

    expect(mockAxios.post).toHaveBeenCalledWith(
      'https://dev-api.posport.io/api/v1/auth/logout',
      {},
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    expect(mockLogout).toHaveBeenCalled()
    expect(mockTokenManager.clearTokens).toHaveBeenCalled()
  })

  it('should handle logout error gracefully', async () => {
    const mockLogout = jest.fn()
    mockUseUserDataStore.mockReturnValue(mockLogout)
    mockTokenManager.getAccessToken.mockReturnValue('test-token')
    mockAxios.post.mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useLogout())

    await result.current()

    expect(mockAxios.post).toHaveBeenCalled()
    expect(mockLogout).toHaveBeenCalled()
    expect(mockTokenManager.clearTokens).toHaveBeenCalled()
  })
})

