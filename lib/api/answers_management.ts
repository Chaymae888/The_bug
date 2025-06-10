import {Answer} from "@/types/answer";
import {api} from "@/lib/api/endpoints";
import {toast} from "sonner";

export const addAnswer = async (questionId: number,content:string, accessToken:string):Promise<Answer> => {
    const res = await api.answers.add(questionId, content, accessToken);
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('Server error details:', errorData);
        throw new Error(errorData.message || 'add answers failed');
    }
    return await res.json();
}
interface Voter {
    userId : number,
    voteType : string
};
export const getAnswerVoters= async (answerId:number):Promise<Voter[]> => {
    const res = await api.answers.getVoters(answerId);

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('Server error details:', errorData);
        throw new Error(errorData.message || 'get voters list failed');
    }
    return await res.json();

}
export const upvoteAnswer = async (
    answerId: number,
    accessToken: string
): Promise<string> => {
    try {
        const res = await api.answers.upvote(answerId, accessToken);

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));

            if (res.status === 403) {
                toast.error('You need at least 15 reputation to upvote');
                return "";
            }

            console.error('Server error details:', errorData);
            throw new Error(errorData.message || 'Upvote failed');
        }

        return await res.json();

    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }
        throw error;
    }
};

export const downvoteAnswer = async (
    answerId: number,
    accessToken: string
): Promise<string> => {
    try {
        const res = await api.answers.downvote(answerId, accessToken);

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));

            if (res.status === 403) {
                toast.error('You need at least 125 reputation to downvote');
                return "";
            }

            console.error('Server error details:', errorData);
            throw new Error(errorData.message || 'Downvote failed');
        }

        return await res.json();

    } catch (error) {
        if (error instanceof Error ) {
            console.error(error.message);
        }
        throw error;
    }
};

export const acceptAnswer= async (answerId:number,accessToken:string):Promise<Answer>=>{
    try {
        const res = await api.answers.accept(answerId, accessToken);

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));


            console.error('Server error details:', errorData);
            throw new Error(errorData.message || 'accept answer failed');
        }

        return await res.json();

    } catch (error) {
        if (error instanceof Error ) {
            console.error(error.message);
        }
        throw error;
    }
}
export const getAnswer= async (answerId:number):Promise<Answer>=>{
    const res = await api.answers.getAnswer(answerId);
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('Server error details:', errorData);
        throw new Error(errorData.message || 'get answer failed');
    }
    return await res.json();
}