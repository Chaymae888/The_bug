import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  login,
  signup,
  logout,
  refreshToken,
  confirmEmail,
} from '@/lib/api/auth';
import { User } from '@/types/user';

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  user: User | null;
  login: (user: { email: string; password: string }) => Promise<void>;
  signup: (user: { username: string; email: string; password: string }) => Promise<void>;
  confirmEmail: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuthToken: () => Promise<void>;
  setUser: (user: User) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      user: null,
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
          const newUser = await signup(user);
          set({ user: newUser });
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
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
          set({ isAuthenticated: false });
        }
      },
      setUser: (user: User) => set({ user }),
    }),
    {
      name: 'auth-storage', 
      partialize: (state) => ({ 
        accessToken: state.accessToken, 
        refreshToken: state.refreshToken ,
        user: state.user
      }),
    }
  )
);