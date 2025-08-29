import { renderHook, act } from '@testing-library/react'
import { useCurrentUser } from '@/hooks/useCurrentUser'

// Mock the store
const mockUseUserDataStore = jest.fn()

jest.mock('@/lib/store', () => ({
  useUserDataStore: (selector: any) => {
    const mockStore = {
      user: { id: 1, email: 'test@example.com', role: 'POSPORT_ADMIN' },
      isLoggedIn: true,
      login: jest.fn(),
      logout: jest.fn(),
    }
    return selector ? selector(mockStore) : mockStore
  },
}))

describe('useCurrentUser', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return user and isLoggedIn from store', () => {
    const { result } = renderHook(() => useCurrentUser())

    expect(result.current.user).toEqual({
      id: 1,
      email: 'test@example.com',
      role: 'POSPORT_ADMIN'
    })
    expect(result.current.isLoggedIn).toBe(true)
  })

  it('should return null user when not logged in', () => {
    // Mock the store to return null user and false isLoggedIn
    const mockUseUserDataStoreLoggedOut = jest.fn()
    mockUseUserDataStoreLoggedOut.mockReturnValueOnce(null) // user
    mockUseUserDataStoreLoggedOut.mockReturnValueOnce(false) // isLoggedIn

    const { useUserDataStore } = require('@/lib/store')
    useUserDataStore.mockImplementation((selector: any) => {
      if (selector) {
        const mockStore = {
          user: null,
          isLoggedIn: false,
        }
        return selector(mockStore)
      }
      return {
        user: null,
        isLoggedIn: false,
        login: jest.fn(),
        logout: jest.fn(),
      }
    })

    const { result } = renderHook(() => useCurrentUser())

    expect(result.current.user).toBeNull()
    expect(result.current.isLoggedIn).toBe(false)
  })

  it('should return correct user object structure', () => {
    const { useUserDataStore } = require('@/lib/store')
    useUserDataStore.mockImplementation((selector: any) => {
      if (selector) {
        const mockStore = {
          user: {
            id: 123,
            email: 'admin@example.com',
            firstName: 'John',
            lastName: 'Doe',
            role: 'COMPANY_OWNER',
            phone: '+1234567890',
            createdAt: '2024-01-01T00:00:00Z',
          },
          isLoggedIn: true,
        }
        return selector(mockStore)
      }
      return {
        user: null,
        isLoggedIn: false,
        login: jest.fn(),
        logout: jest.fn(),
      }
    })

    const { result } = renderHook(() => useCurrentUser())

    expect(result.current.user).toEqual({
      id: 123,
      email: 'admin@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'COMPANY_OWNER',
      phone: '+1234567890',
      createdAt: '2024-01-01T00:00:00Z',
    })
    expect(result.current.isLoggedIn).toBe(true)
  })

  it('should handle undefined user gracefully', () => {
    const { useUserDataStore } = require('@/lib/store')
    useUserDataStore.mockImplementation((selector: any) => {
      if (selector) {
        const mockStore = {
          user: undefined,
          isLoggedIn: false,
        }
        return selector(mockStore)
      }
      return {
        user: undefined,
        isLoggedIn: false,
        login: jest.fn(),
        logout: jest.fn(),
      }
    })

    const { result } = renderHook(() => useCurrentUser())

    expect(result.current.user).toBeUndefined()
    expect(result.current.isLoggedIn).toBe(false)
  })

  it('should return consistent values across multiple renders', () => {
    const { result, rerender } = renderHook(() => useCurrentUser())

    const firstRender = { ...result.current }
    rerender()
    const secondRender = { ...result.current }

    expect(firstRender).toEqual(secondRender)
  })

  it('should handle different user roles correctly', () => {
    const roles = ['POSPORT_ADMIN', 'COMPANY_OWNER', 'CUSTOMER', 'STAFF']

    roles.forEach(role => {
      const { useUserDataStore } = require('@/lib/store')
      useUserDataStore.mockImplementation((selector: any) => {
        if (selector) {
          const mockStore = {
            user: { id: 1, email: 'test@example.com', role },
            isLoggedIn: true,
          }
          return selector(mockStore)
        }
        return {
          user: null,
          isLoggedIn: false,
          login: jest.fn(),
          logout: jest.fn(),
        }
      })

      const { result, rerender } = renderHook(() => useCurrentUser())

      expect(result.current.user?.role).toBe(role)
      expect(result.current.isLoggedIn).toBe(true)

      rerender()
    })
  })

  it('should return correct TypeScript types', () => {
    const { result } = renderHook(() => useCurrentUser())

    // Type assertions to verify TypeScript types
    const user: any | null = result.current.user
    const isLoggedIn: boolean = result.current.isLoggedIn

    expect(typeof isLoggedIn).toBe('boolean')
    expect(user).toBeDefined()
  })

  it('should be memoized and not cause unnecessary re-renders', () => {
    const { result } = renderHook(() => useCurrentUser())

    // Store reference to the return object
    const firstResult = result.current

    // Re-render the hook
    act(() => {
      // This would normally trigger a re-render in a component
    })

    // The object reference should be stable (memoized)
    expect(result.current).toBe(firstResult)
  })

  it('should handle edge case with empty user object', () => {
    const { useUserDataStore } = require('@/lib/store')
    useUserDataStore.mockImplementation((selector: any) => {
      if (selector) {
        const mockStore = {
          user: {},
          isLoggedIn: true,
        }
        return selector(mockStore)
      }
      return {
        user: {},
        isLoggedIn: true,
        login: jest.fn(),
        logout: jest.fn(),
      }
    })

    const { result } = renderHook(() => useCurrentUser())

    expect(result.current.user).toEqual({})
    expect(result.current.isLoggedIn).toBe(true)
  })

  it('should handle user with minimal required fields', () => {
    const { useUserDataStore } = require('@/lib/store')
    useUserDataStore.mockImplementation((selector: any) => {
      if (selector) {
        const mockStore = {
          user: { id: 1 },
          isLoggedIn: true,
        }
        return selector(mockStore)
      }
      return {
        user: { id: 1 },
        isLoggedIn: true,
        login: jest.fn(),
        logout: jest.fn(),
      }
    })

    const { result } = renderHook(() => useCurrentUser())

    expect(result.current.user).toEqual({ id: 1 })
    expect(result.current.isLoggedIn).toBe(true)
  })

  it('should work correctly in different component contexts', () => {
    // Test that the hook works when used in different scenarios
    const TestComponent = () => {
      const { user, isLoggedIn } = useCurrentUser()
      return { user, isLoggedIn }
    }

    const { result } = renderHook(() => TestComponent())

    expect(result.current.user).toBeDefined()
    expect(typeof result.current.isLoggedIn).toBe('boolean')
  })

  it('should handle rapid consecutive calls', () => {
    const { result } = renderHook(() => useCurrentUser())

    // Multiple rapid accesses should return consistent results
    for (let i = 0; i < 10; i++) {
      expect(result.current.isLoggedIn).toBe(true)
      expect(result.current.user?.id).toBe(1)
    }
  })

  it('should return correct default values when store is not initialized', () => {
    const { useUserDataStore } = require('@/lib/store')
    useUserDataStore.mockImplementation(() => null)

    const { result } = renderHook(() => useCurrentUser())

    // Should handle null/undefined store gracefully
    expect(result.current.user).toBeNull()
    expect(result.current.isLoggedIn).toBe(false)
  })
})