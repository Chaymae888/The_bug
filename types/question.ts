export interface Question {
    id: number,
    title:string,
    content:string,
    createdAt:string,
    updatedAt:string,
    authorUsername:string,
    authorEmail:string,
    viewCount:number,
    voteScore:number,
    answerCount:number,
    tags:[
        {
            name:string,
        }
    ]
}