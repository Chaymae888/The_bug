const BASE_URL = 'http://localhost:8000';


const API_KEYS = {
  auth: {
    login: 'auth/login/user',
    logout: 'auth/logout',
    refreshToken: 'auth/refresh-token',
  },
  register: {
    signup: 'api/register/users',
    confirmEmail: 'register/users/confirmation',
  },
    predictToxicity : 'predict'
} as const;


export type UserInfo = {
  username: string;
  email: string;
  password: string;
};

export const api = {
  auth: {
    login: (credentials: { email: string; password: string }) => 
      fetch(`${BASE_URL}/${API_KEYS.auth.login}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      }),
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
        body: JSON.stringify({infoUser:user})
    }),
    confirmEmail: (token: string) => 
      fetch(API_KEYS.register.confirmEmail, { method: 'GET', body: JSON.stringify({ token }) }),
  },
    checkComment :(text: string) =>
        fetch(`${BASE_URL}/${API_KEYS.predictToxicity}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text }),
        })
  
} as const;
