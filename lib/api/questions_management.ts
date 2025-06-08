import {api, QuestionInfo} from './endpoints';
import {Question} from "@/types/question";

export const addQuestion = async (question : QuestionInfo ,accessToken:string):Promise<Question>=>{
    const res = await api.questions.ask(question, accessToken);
    if (!res.ok) throw new Error('ask question failed');
    return await res.json();
}