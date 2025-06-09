import {Answer} from "@/types/answer";
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
    answers: Answer[],
    upvotersId:number[],
    downvotersId:number[],

}