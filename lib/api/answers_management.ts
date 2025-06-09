import {Answer} from "@/types/answer";
import {api} from "@/lib/api/endpoints";

export const addAnswer = async (questionId: number,content:string, accessToken:string):Promise<Answer> => {
    const res = await api.answers.add(questionId, content, accessToken);
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('Server error details:', errorData);
        throw new Error(errorData.message || 'add answers failed');
    }
    return await res.json();
}