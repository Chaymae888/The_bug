import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  login,
  signup,
  logout,
  refreshToken,
  confirmEmail,
  fetchOAuthSuccess,
} from '@/lib/api/auth';

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (user: { email: string; password: string }) => Promise<void>;
  signup: (user: { username: string; email: string; password: string;}) => Promise<void>;
  confirmEmail: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuthToken: () => Promise<void>;
  handleOAuthSuccess: () => Promise<void>;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      login: async (user) => {
        try {
          const { accessToken } = await login(user);
          set({ accessToken ,  isAuthenticated: true});
        } catch (err) {
          throw err;
        }
      },
      signup: async (user) => {
        try {
          await signup(user);
        } catch (err) {
        throw err;
        }
      },
      confirmEmail: async (token) => {
        try {
          await confirmEmail(token);
          set({ isAuthenticated: true});
        } catch (err) {
         throw err;
        }
      },
      logout: async () => {
        await logout();
        set({ accessToken: null, refreshToken: null, isAuthenticated: false });
      },
      refreshAuthToken: async () => {
        try {
          const { accessToken, refreshToken: newRefreshToken } = await refreshToken();
          set({ accessToken, refreshToken: newRefreshToken, isAuthenticated: true });
        } catch (err) {
          set({ isAuthenticated: false });
        }
      },
      handleOAuthSuccess: async () => {
        try {
          const { accessToken, refreshToken } = await fetchOAuthSuccess();
          set({ accessToken, refreshToken, isAuthenticated: true });
        } catch (err) {
          throw err;
        }
      },
    }),
    {
      name: 'auth-storage', 
      partialize: (state) => ({ 
        accessToken: state.accessToken, 
        refreshToken: state.refreshToken 
      }),
    }
  )
);