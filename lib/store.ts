import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface UserDataState {
  isLoggedIn: boolean;
  user: any | null; // Store the user object
  tokens: {
    access: { token: string; expiresIn: string };
    refresh: { token: string; expiresIn: string };
  } | null;
  login: (data: any) => void; // Accept the full login response
  logout: () => void;
  setUser: (user: any) => void;
  setTokens: (tokens: any) => void;
}

export const useUserDataStore = create<UserDataState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: null,
      tokens: null,
      login: (data: any) => set({
        isLoggedIn: true,
        user: data.user,
        tokens: data.tokens,
      }),
      logout: () => set({ isLoggedIn: false, user: null, tokens: null }),
      setUser: (user: any) => set({ user }),
      setTokens: (tokens: any) => set({ tokens }),
    }),
    {
      name: 'user-data-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
