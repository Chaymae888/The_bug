import { User } from '@/types/user';
import { api, UserInfo } from './endpoints';



type AuthResponse = {
  "access-token": string;
  user: User;
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

// Login
export const login = async (user: Omit<UserInfo, 'username'>): Promise<AuthResponse> => {
  const res = await api.auth.login(user);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

// Refresh Token
export const refreshToken = async (): Promise<AuthResponse> => {
  const res = await api.auth.refreshToken();
  if (!res.ok) throw new Error('Token refresh failed');
  return res.json();
};

export const exchangeToken = async (token : string): Promise<string>=>{
  const res = await api.register.exchangeToken(token);
  if (!res.ok) throw new Error('Token exchange failed');
  const data = await res.json();
  return data['access-token'];
}

export const confirmEmail=async(token:string):Promise<string>=>{
  const res=await api.register.confirmEmail(token);
    if (!res.ok) throw new Error('Confirmation failed');
  return await res.json();
}



