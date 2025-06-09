import {User} from "@/types/user";

export interface Question {
    id: number,
    title:string,
    content:string,
    plainTextContent: string,
    createdAt:string,
    updatedAt:string,
    user :User,
    viewCount:number,
    voteScore:number,
    answerCount:number,
    tags:[
        {
            name:string,
        }
    ],

}