import { useUserDataStore } from '@/lib/store'

describe('Store', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    // Reset store state
    useUserDataStore.setState({
      isLoggedIn: false,
      user: null,
      tokens: null,
    })
  })

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const state = useUserDataStore.getState()
      
      expect(state.user).toBeNull()
      expect(state.tokens).toBeNull()
      expect(state.isLoggedIn).toBe(false)
    })
  })

  describe('User Management', () => {
    it('should set user data', () => {
      const mockUser = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        role: 'POSPORT_ADMIN',
        isEmailVerified: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      }

      useUserDataStore.getState().setUser(mockUser)
      
      const state = useUserDataStore.getState()
      expect(state.user).toEqual(mockUser)
    })

    it('should update user data', () => {
      const initialUser = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        role: 'POSPORT_ADMIN',
        isEmailVerified: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      }

      useUserDataStore.getState().setUser(initialUser)
      useUserDataStore.getState().updateUser({ firstName: 'Jane' })
      
      const state = useUserDataStore.getState()
      expect(state.user?.firstName).toBe('Jane')
      expect(state.user?.lastName).toBe('Doe') // Should remain unchanged
    })
  })

  describe('Token Management', () => {
    it('should set tokens', () => {
      const mockTokens = {
        access: {
          token: 'access-token',
          expiresIn: '15m',
        },
        refresh: {
          token: 'refresh-token',
          expiresIn: '7d',
        },
      }

      useUserDataStore.getState().setTokens(mockTokens)
      
      const state = useUserDataStore.getState()
      expect(state.tokens).toEqual(mockTokens)
    })
  })

  describe('Login Flow', () => {
    it('should handle complete login flow', () => {
      const mockUser = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        role: 'POSPORT_ADMIN',
        isEmailVerified: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      }
      const mockTokens = {
        access: {
          token: 'access-token',
          expiresIn: '15m',
        },
        refresh: {
          token: 'refresh-token',
          expiresIn: '7d',
        },
      }

      useUserDataStore.getState().login({ user: mockUser, tokens: mockTokens })
      
      const state = useUserDataStore.getState()
      expect(state.user).toEqual(mockUser)
      expect(state.tokens).toEqual(mockTokens)
      expect(state.isLoggedIn).toBe(true)
    })
  })

  describe('Logout Flow', () => {
    it('should handle complete logout flow', () => {
      const mockUser = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        role: 'POSPORT_ADMIN',
        isEmailVerified: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      }
      const mockTokens = {
        access: {
          token: 'access-token',
          expiresIn: '15m',
        },
        refresh: {
          token: 'refresh-token',
          expiresIn: '7d',
        },
      }

      // Set up authenticated state
      useUserDataStore.getState().login({ user: mockUser, tokens: mockTokens })
      
      // Perform logout
      useUserDataStore.getState().logout()
      
      const state = useUserDataStore.getState()
      expect(state.user).toBeNull()
      expect(state.tokens).toBeNull()
      expect(state.isLoggedIn).toBe(false)
    })
  })

  describe('User Role Management', () => {
    it('should handle different user roles', () => {
      const adminUser = {
        id: '1',
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@example.com',
        role: 'POSPORT_ADMIN',
        isEmailVerified: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      }

      const regularUser = {
        id: '2',
        firstName: 'Regular',
        lastName: 'User',
        email: 'user@example.com',
        role: 'USER',
        isEmailVerified: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      }

      useUserDataStore.getState().setUser(adminUser)
      let state = useUserDataStore.getState()
      expect(state.user?.role).toBe('POSPORT_ADMIN')

      useUserDataStore.getState().setUser(regularUser)
      state = useUserDataStore.getState()
      expect(state.user?.role).toBe('USER')
    })
  })

  describe('State Persistence', () => {
    it('should persist state to localStorage', () => {
      const mockUser = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        role: 'POSPORT_ADMIN',
        isEmailVerified: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      }
      const mockTokens = {
        access: {
          token: 'access-token',
          expiresIn: '15m',
        },
        refresh: {
          token: 'refresh-token',
          expiresIn: '7d',
        },
      }

      useUserDataStore.getState().login({ user: mockUser, tokens: mockTokens })

      // Check if data is persisted
      const persistedData = localStorage.getItem('user-data-storage')
      expect(persistedData).toBeTruthy()
      
      const parsedData = JSON.parse(persistedData!)
      expect(parsedData.state.user).toEqual(mockUser)
      expect(parsedData.state.tokens).toEqual(mockTokens)
      expect(parsedData.state.isLoggedIn).toBe(true)
    })
  })

  describe('Error Handling', () => {
    it('should handle null user data', () => {
      useUserDataStore.getState().setUser(null)
      
      const state = useUserDataStore.getState()
      expect(state.user).toBeNull()
    })

    it('should handle undefined user data', () => {
      useUserDataStore.getState().setUser(undefined as any)
      
      const state = useUserDataStore.getState()
      expect(state.user).toBeUndefined()
    })
  })

  describe('State Updates', () => {
    it('should trigger state updates', () => {
      const mockUser = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        role: 'POSPORT_ADMIN',
        isEmailVerified: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      }

      let updateCount = 0
      const unsubscribe = useUserDataStore.subscribe((state) => {
        updateCount++
      })

      useUserDataStore.getState().setUser(mockUser)
      
      expect(updateCount).toBeGreaterThan(0)
      
      unsubscribe()
    })
  })

  describe('Selectors', () => {
    it('should select user correctly', () => {
      const mockUser = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        role: 'POSPORT_ADMIN',
        isEmailVerified: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      }

      useUserDataStore.getState().setUser(mockUser)
      
      const user = useUserDataStore.getState().user
      expect(user).toEqual(mockUser)
    })

    it('should select tokens correctly', () => {
      const mockTokens = {
        access: {
          token: 'access-token',
          expiresIn: '15m',
        },
        refresh: {
          token: 'refresh-token',
          expiresIn: '7d',
        },
      }

      useUserDataStore.getState().setTokens(mockTokens)
      
      const tokens = useUserDataStore.getState().tokens
      expect(tokens).toEqual(mockTokens)
    })

    it('should select authentication status correctly', () => {
      const mockUser = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        role: 'POSPORT_ADMIN',
        isEmailVerified: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      }
      const mockTokens = {
        access: {
          token: 'access-token',
          expiresIn: '15m',
        },
        refresh: {
          token: 'refresh-token',
          expiresIn: '7d',
        },
      }

      useUserDataStore.getState().login({ user: mockUser, tokens: mockTokens })
      
      const isLoggedIn = useUserDataStore.getState().isLoggedIn
      expect(isLoggedIn).toBe(true)
    })
  })
})

