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
      ask:'api/questions',
      follow:'api/follow/questions',
    },
    users:{
      get:'api/users',
      follow:'api/users/follow',
      unfollow:'api/users/unfollow'
    },
    answers:{
      add: 'api/answers',
    },
    tags:{
      get: 'api/tags',
      follow:'api/follow/tags',
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
        ask: (question: QuestionInfo, accessToken: string) =>
            fetch(`${BACKEND_URL}/${API_KEYS.questions.ask}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    title: question.title,
                    content: question.content,
                    tagNames: question.tagNames,
                })
            }),
        get:()=>
            fetch(`${BACKEND_URL}/${API_KEYS.questions.ask}`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            }),
        follow:(questionId:number, accessToken: string) =>
            fetch(`${BACKEND_URL}/${API_KEYS.questions.follow}/${questionId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                }
            }),
        unfollow:(questionId:number, accessToken: string) =>
            fetch(`${BACKEND_URL}/${API_KEYS.questions.follow}/${questionId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                }
            }),
        upvote:(questionId:number, accessToken: string) =>
            fetch(`${BACKEND_URL}/${API_KEYS.questions.ask}/${questionId}/upvote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                }
            }),
        downvote:(questionId:number, accessToken: string) =>
            fetch(`${BACKEND_URL}/${API_KEYS.questions.ask}/${questionId}/downvote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                }
            }),
    },
    users:{
        get:()=>
            fetch(`${BACKEND_URL}/${API_KEYS.users.get}`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            }),
      follow:(userId:number, accessToken: string) =>
          fetch(`${BACKEND_URL}/${API_KEYS.users.follow}/${userId}`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${accessToken}`,
              }
          }),
        unfollow:(userId:number, accessToken: string) =>
            fetch(`${BACKEND_URL}/${API_KEYS.users.unfollow}/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                }
            })
    },
    answers:{
      add:(questionId:number,content:string, accessToken: string) =>
          fetch(`${BACKEND_URL}/${API_KEYS.answers.add}`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${accessToken}`,
              },
              body: JSON.stringify({
                  content: content,
                  questionId: questionId,
              })
          })
    },
    tags:{
      get:() =>
          fetch(`${BACKEND_URL}/${API_KEYS.tags.get}`, {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
              }
          }),
      follow:(tagId:number, accessToken: string) =>
            fetch(`${BACKEND_URL}/${API_KEYS.tags.follow}/${tagId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                }
            }),
      unfollow:(tagId:number, accessToken: string) =>
            fetch(`${BACKEND_URL}/${API_KEYS.tags.follow}/${tagId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                }
            }),
    }
  
} as const;
