export interface Answer {
    id: number,
    content: string,
    createdAt: string,
    updatedAt: string,
    isAccepted: boolean,
    voteScore: number,
    authorUsername: string,
    authorEmail: string,
    questionId: number,
}