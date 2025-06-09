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
        vote:'api/votes/questions',
    },
    users:{
      get:'api/users',
      follow:'api/users/follow',
      unfollow:'api/users/unfollow'
    },
    answers:{
      add: 'api/answers',
      vote:'api/votes/answers'
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
        getFollowings:(accessToken: string) =>
            fetch(`${BACKEND_URL}/${API_KEYS.questions.follow}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                }
            }),
        upvote:(questionId:number, accessToken: string) =>
            fetch(`${BACKEND_URL}/${API_KEYS.questions.vote}/${questionId}/upvote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                }
            }),
        downvote:(questionId:number, accessToken: string) =>
            fetch(`${BACKEND_URL}/${API_KEYS.questions.vote}/${questionId}/downvote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                }
            }),
        getVoters:(questionId:number)=>
            fetch(`${BACKEND_URL}/${API_KEYS.questions.ask}/${questionId}/voters`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            }),
        getQuestion:(questionId:number)=>
            fetch(`${BACKEND_URL}/${API_KEYS.questions.ask}/${questionId}`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
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
            }),
        getFollowings:(userId:number)=>
            fetch(`${BACKEND_URL}/${API_KEYS.users.get}/${userId}/following`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            }),
        getQuestions:(userId:number)=>
            fetch(`${BACKEND_URL}/${API_KEYS.users.get}/${userId}/questions`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            }),
        getAnswers:(userId:number)=>
            fetch(`${BACKEND_URL}/${API_KEYS.users.get}/${userId}/answers`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            }),
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
          }),
        getVoters:(answerId:number)=>
            fetch(`${BACKEND_URL}/${API_KEYS.answers.add}/${answerId}/voters`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            }),
        upvote:(answerId:number, accessToken: string) =>
            fetch(`${BACKEND_URL}/${API_KEYS.answers.vote}/${answerId}/upvote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                }
            }),
        downvote:(answerId:number, accessToken: string) =>
            fetch(`${BACKEND_URL}/${API_KEYS.answers.vote}/${answerId}/downvote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                }
            }),
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
        getFollowings:(accessToken: string) =>
            fetch(`${BACKEND_URL}/${API_KEYS.tags.follow}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                }
            }),
        getQuestions:(tagName:string)=>
            fetch(`${BACKEND_URL}/${API_KEYS.tags.get}/${tagName}/questions`,{
                method: 'GET',
                headers:{
                    'Content-Type': 'application/json',
                }
            }),
        getTag:(tagName:string)=>
            fetch(`${BACKEND_URL}/${API_KEYS.tags.get}/${tagName}`,{
                method: 'GET',
                headers:{
                    'Content-Type':'application/json',
                }
            })
    }
  
} as const;
