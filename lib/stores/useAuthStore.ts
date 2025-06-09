import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  login,
  signup,
  confirmEmail,
  // refreshToken,
  exchangeToken
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
  exchangeToken: (token:string) => Promise<void>;
  logout: () => void;
  hydrated: boolean;
  setUser: (user: User | null) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      hydrated: false,
      user: null,
      login: async (user) => {
        try {
          const data = await login(user);
          set({ accessToken : data.accessToken,  isAuthenticated: true, user: data.user});
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
      confirmEmail:async(token)=>{
          try{
              await confirmEmail(token);
              set({ isAuthenticated: true});
          }catch (err){
              throw err;
          }
      },
      exchangeToken: async (token)=>{
          try{
              const newAccessToken=await exchangeToken(token);
              set({accessToken:newAccessToken});

          }catch (err) {
              throw err;
          }
      },
      logout: () => {
        set({ accessToken: null, refreshToken: null, isAuthenticated: false,user:null });
      },
      // refreshAuthToken: async () => {
      //   try {
      //     const { accessToken, refreshToken: newRefreshToken } = await refreshToken();
      //     set({ accessToken, refreshToken: newRefreshToken, isAuthenticated: true });
      //       // eslint-disable-next-line @typescript-eslint/no-unused-vars
      //   } catch (err) {
      //     set({ isAuthenticated: false });
      //   }
      // },
      setUser: (user: User | null) => set({ user }),
    }
    ),
    {
      name: 'auth-storage', 
      partialize: (state) => ({ 
        accessToken: state.accessToken, 
        refreshToken: state.refreshToken ,
        user: state.user
      }),
        onRehydrateStorage: () => (state) => {
            if (state) {
                state.isAuthenticated = !!state.accessToken;
                state.hydrated = true;
            }
        },
    }
  )
);