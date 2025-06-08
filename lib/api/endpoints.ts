const BACKEND_URL = 'http://localhost:8080';

const AI_URL ='http://localhost:8000';


const API_KEYS = {
  auth: {
    login: 'auth/login/user',
    refreshToken: 'auth/refresh-token',
  },
  register: {
    signup: 'api/register/users',
    exchangeToken:'api/users/exchange-token'
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
      fetch(`${BACKEND_URL}/${API_KEYS.auth.login}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      }),
    refreshToken: () => 
        fetch(API_KEYS.auth.refreshToken, { method: 'POST' }),
  },
  register: {
    signup: (user: UserInfo) =>
      fetch(`${BACKEND_URL}/${API_KEYS.register.signup}`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json' 
      },
        body: JSON.stringify({infoUser:user})
    }),
    exchangeToken:(token: string)=>
        fetch(`${BACKEND_URL}/${API_KEYS.register.exchangeToken}`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),

        })

  },
    checkComment :(text: string) =>
        fetch(`${AI_URL}/${API_KEYS.predictToxicity}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text }),
        })
  
} as const;
