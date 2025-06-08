export interface User {
  userId: number,
  infoUser: {
    userId: number,
    username: string,
    email: string
  },
  reputation:number,
  photoUrl: string,
  followersCount: number,
  followingCount: number,
  country: string,
  createdDate: string,
  lastSeen: string,
  githubLink: string,
  portfolioLink: string,
  about: string,
  questionCount:number,
  voteCount:number,
  answerCount:number,
  reachedCount:number,
  confirmed: boolean
}