import { renderHook } from '@testing-library/react'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useUserDataStore } from '@/lib/store'

// Mock the store
jest.mock('@/lib/store', () => ({
  useUserDataStore: jest.fn((selector) => {
    const mockState = {
      isLoggedIn: false,
      user: null,
      tokens: null,
      login: jest.fn(),
      logout: jest.fn(),
      setUser: jest.fn(),
      setTokens: jest.fn(),
      updateUser: jest.fn(),
    };
    return selector ? selector(mockState) : mockState;
  })
}))

describe('useCurrentUser', () => {
  const mockUseUserDataStore = useUserDataStore as jest.MockedFunction<typeof useUserDataStore>

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return user and isLoggedIn from store', () => {
    const mockUser = {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      role: 'COMPANY_OWNER',
      isEmailVerified: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
    
    const mockState = {
      isLoggedIn: true,
      user: mockUser,
      tokens: null,
      login: jest.fn(),
      logout: jest.fn(),
      setUser: jest.fn(),
      setTokens: jest.fn(),
      updateUser: jest.fn(),
    }

    mockUseUserDataStore.mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector(mockState)
      }
      return mockState
    })

    const { result } = renderHook(() => useCurrentUser())

    expect(result.current.user).toEqual(mockUser)
    expect(result.current.isLoggedIn).toBe(true)
  })

  it('should return null user and false isLoggedIn when not logged in', () => {
    const mockState = {
      isLoggedIn: false,
      user: null,
      tokens: null,
      login: jest.fn(),
      logout: jest.fn(),
      setUser: jest.fn(),
      setTokens: jest.fn(),
      updateUser: jest.fn(),
    }

    mockUseUserDataStore.mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector(mockState)
      }
      return mockState
    })

    const { result } = renderHook(() => useCurrentUser())

    expect(result.current.user).toBeNull()
    expect(result.current.isLoggedIn).toBe(false)
  })

  it('should call useUserDataStore with correct selectors', () => {
    const mockState = {
      isLoggedIn: false,
      user: null,
      tokens: null,
      login: jest.fn(),
      logout: jest.fn(),
      setUser: jest.fn(),
      setTokens: jest.fn(),
      updateUser: jest.fn(),
    }

    mockUseUserDataStore.mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector(mockState)
      }
      return mockState
    })

    renderHook(() => useCurrentUser())

    expect(mockUseUserDataStore).toHaveBeenCalledTimes(2)
    expect(mockUseUserDataStore).toHaveBeenCalledWith(expect.any(Function))
  })
})
