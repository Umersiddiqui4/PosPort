import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User, AuthTokens, PartialUser } from '@/types';

interface UserDataState {
  isLoggedIn: boolean;
  user: User | null;
  tokens: AuthTokens | null;
  login: (data: { user: User | PartialUser; tokens: AuthTokens }) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setTokens: (tokens: AuthTokens) => void;
  updateUser: (updates: Partial<User>) => void;
}

export const useUserDataStore = create<UserDataState>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      user: null,
      tokens: null,
                        login: (data: { user: User | PartialUser; tokens: AuthTokens }) => set({
                    isLoggedIn: true,
                    user: data.user as User,
                    tokens: data.tokens,
                  }),
      logout: () => set({ 
        isLoggedIn: false, 
        user: null, 
        tokens: null 
      }),
      setUser: (user: User) => set({ user }),
      setTokens: (tokens: AuthTokens) => set({ tokens }),
      updateUser: (updates: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...updates } });
        }
      },
    }),
    {
      name: 'user-data-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        user: state.user,
        tokens: state.tokens,
      }),
      onRehydrateStorage: () => (state) => {
        // Validate stored data on rehydration
        if (state?.user && !state.user.id) {
          console.warn('Invalid user data in storage, clearing...');
          state.user = null;
          state.isLoggedIn = false;
        }
      },
    }
  )
);

// Selector hooks for better performance
export const useUser = () => useUserDataStore((state) => state.user);
export const useIsLoggedIn = () => useUserDataStore((state) => state.isLoggedIn);
export const useTokens = () => useUserDataStore((state) => state.tokens);
export const useUserRole = () => useUserDataStore((state) => state.user?.role);
export const useCompanyId = () => useUserDataStore((state) => state.user?.companyId);
export const useLocationId = () => useUserDataStore((state) => state.user?.locationId);
