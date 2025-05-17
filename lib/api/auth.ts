import { api } from './endpoints';

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
export const signup = async (user: InfoUser): Promise<void> => {
  const res = await api.register.signup(user);
  const contentType = res.headers.get('content-type');
  
  if (contentType && contentType.includes('text/html')) {
    if (!res.ok) {
      throw new Error('Registration failed - server returned HTML');
    }
    return; // Success case for HTML response
  }

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Registration failed');
  }
  // Success case for JSON response
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

// OAuth Success (Google/Github)
export const fetchOAuthSuccess = async (): Promise<AuthResponse> => {
  const res = await api.oauth2.success();
  if (!res.ok) throw new Error('OAuth failed');
  return res.json();
};