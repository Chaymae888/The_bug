const API_KEYS = {
  auth: {
    login: 'auth/login/users',
    logout: 'auth/logout',
    refreshToken: 'auth/refresh-token',
  },
  register: {
    signup: 'register/users',
    confirmEmail: 'register/users/confirmation',
  },
  oauth: {
    success: '/api/login/oauth2/success',
  },
} as const;
const BASE_URL = 'http://localhost:8080';
export type UserInfo = {
  username: string;
  email: string;
  password: string;
};

export const api = {
  auth: {
    login: (credentials: { email: string; password: string }) => 
      fetch(API_KEYS.auth.login, { method: 'POST',headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(credentials) }),
    refreshToken: () => 
        fetch(API_KEYS.auth.refreshToken, { method: 'POST' }),
    logout: () => fetch(API_KEYS.auth.logout, { method: 'POST' }),
  },
  register: {
    signup: (user: UserInfo) =>
      fetch(`${BASE_URL}/${API_KEYS.register.signup}`, { 
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json' 
      },
        body: JSON.stringify(user)
    }),
    confirmEmail: (token: string) => 
      fetch(API_KEYS.register.confirmEmail, { method: 'GET', body: JSON.stringify({ token }) }),
  },
  oauth2: {
    success: () => fetch(API_KEYS.oauth.success, { method: 'GET' }),
  },
  
} as const;
