import { User } from '@/types/user';
import { api, UserInfo } from './endpoints';

// lib/api/auth.ts
type InfoUser = {
  username:string;
  email: string;
  password: string;
  
};

type AuthResponse = {
  accessToken: string;
  refreshToken: string;
};

// Signup
export const signup = async (user: UserInfo): Promise<User> => {
  const res = await api.register.signup(user);
  const data = await res.json();
  
  if (!res.ok) {
    throw new Error(data.message || 'Registration failed');
  }
  
  return data;
}; 
  


// Email Confirmation
export const confirmEmail = async (token: string): Promise<void> => {
  const res = await api.register.confirmEmail(token);
  if (!res.ok) throw new Error('Confirmation failed');
};

// Login
export const login = async (user: Omit<InfoUser, 'username'>): Promise<AuthResponse> => {
  const res = await api.auth.login(user);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

// Logout
export const logout = async (): Promise<void> => {
  await api.auth.logout();
};

// Refresh Token
export const refreshToken = async (): Promise<AuthResponse> => {
  const res = await api.auth.refreshToken();
  if (!res.ok) throw new Error('Token refresh failed');
  return res.json();
};

