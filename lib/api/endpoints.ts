const BACKEND_URL = 'http://localhost:8080';

const AI_URL ='http://localhost:8000';


const API_KEYS = {
  auth: {
    login: 'auth/login/user',
    refreshToken: 'auth/refresh-token',
  },
  register: {
    signup: 'api/register/users',
    confirmEmail :'api/register/users/confirmation',
    exchangeToken:'api/users/exchange-token'
  },
    predictToxicity : 'predict',
    questions:{
      ask:'api/questions'
    }
} as const;


export type UserInfo = {
  username: string;
  email: string;
  password: string;
};

export type QuestionInfo={
    title:string;
    content:string;
    tagNames:string[];
}

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
    confirmEmail:(token : string)=>
      fetch(`${BACKEND_URL}/${API_KEYS.register.confirmEmail}?token=${token}`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          },
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
        }),
    questions: {
      ask :(question:QuestionInfo,accessToken:string)=>
          fetch(`${BACKEND_URL}/${API_KEYS.questions.ask}`,{
              method: 'POST',
              headers:{
                  'Authorization': accessToken,
              },
              body:JSON.stringify(question)
          })
    }
  
} as const;
