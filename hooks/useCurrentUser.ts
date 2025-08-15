/**
 * @fileoverview useCurrentUser Hook
 * 
 * A custom React hook that provides access to the current authenticated user
 * and their authentication status. This hook integrates with the Zustand store
 * to manage user state across the application.
 * 
 * @author Restaurant Management System
 * @version 1.0.0
 */

import { useUserDataStore } from "@/lib/store"

/**
 * Interface for the return value of useCurrentUser hook
 */
interface UseCurrentUserReturn {
  /** The current authenticated user object or null if not authenticated */
  user: any | null
  /** Boolean indicating if the user is currently logged in */
  isLoggedIn: boolean
}

/**
 * useCurrentUser Hook
 * 
 * A custom hook that provides access to the current user's information
 * and authentication status. It uses Zustand selectors for optimal performance
 * by only re-rendering when the specific user data changes.
 * 
 * This hook is used throughout the application to:
 * - Check authentication status
 * - Access user information (name, email, role, etc.)
 * - Implement role-based access control
 * - Display user-specific content
 * 
 * @returns {UseCurrentUserReturn} Object containing user data and login status
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { user, isLoggedIn } = useCurrentUser()
 * 
 *   if (!isLoggedIn) {
 *     return <div>Please log in</div>
 *   }
 * 
 *   return <div>Welcome, {user.firstName}!</div>
 * }
 * ```
 * 
 * @example
 * ```tsx
 * function AdminPanel() {
 *   const { user } = useCurrentUser()
 * 
 *   // Role-based access control
 *   if (user?.role !== 'POSPORT_ADMIN') {
 *     return <div>Access denied</div>
 *   }
 * 
 *   return <AdminContent />
 * }
 * ```
 */
export function useCurrentUser(): UseCurrentUserReturn {
  const user = useUserDataStore((state) => state.user)
  const isLoggedIn = useUserDataStore((state) => state.isLoggedIn)

  return {
    user,
    isLoggedIn,
  }
} 