import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfileDto, LoginDto } from '@/types/api';
import { apiClient } from '@/lib/api';

interface AuthState {
  user: UserProfileDto | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (credentials: LoginDto) => Promise<void>;
  logout: () => Promise<void>;
  getProfile: () => Promise<void>;
  setUser: (user: UserProfileDto | null) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  checkAuth: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (credentials: LoginDto) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiClient.login(credentials);
          // Get full profile after login
          const profile = await apiClient.getProfile();
          set({
            user: profile,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Login failed',
          });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await apiClient.logout();
        } catch (error) {
          // Even if logout fails on server, clear local state
          console.error('Logout error:', error);
        } finally {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      getProfile: async () => {
        set({ isLoading: true, error: null });
        try {
          const profile = await apiClient.getProfile();
          set({
            user: profile,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Failed to get profile',
            isAuthenticated: false,
            user: null,
          });
        }
      },

      setUser: (user: UserProfileDto | null) => {
        set({
          user,
          isAuthenticated: !!user,
        });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },

      checkAuth: () => {
        const isAuthenticated = apiClient.isAuthenticated();
        const user = apiClient.getUser();
        
        set({
          isAuthenticated,
          user: user ? user : null,
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
); 