import {api, QuestionInfo} from './endpoints';
import {Question} from "@/types/question";
import { toast } from 'sonner';

export const addQuestion = async (question: QuestionInfo, accessToken: string): Promise<Question> => {
    const res = await api.questions.ask( question, accessToken);
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('Server error details:', errorData);
        throw new Error(errorData.message || 'ask question failed');
    }
    return await res.json();
}

export const getQuestions= async ():Promise<Question[]> => {
    const res = await api.questions.get();

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('Server error details:', errorData);
        throw new Error(errorData.message || 'get question list failed');
    }
    return await res.json();
}


export const followQuestion=async (questionId: number, accessToken: string):Promise<string> => {
    const res = await api.questions.follow(questionId, accessToken);
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('Server error details:', errorData);
        throw new Error(errorData.message || 'follow question failed');
    }
    return await res.json();
}

export const unfollowQuestion=async (questionId: number, accessToken: string):Promise<string> => {
    const res = await api.questions.unfollow(questionId, accessToken);
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('Server error details:', errorData);
        throw new Error(errorData.message || 'unfollow question failed');
    }
    return await res.json();
}



export const upvoteQuestion = async (
    questionId: number,
    accessToken: string
): Promise<string> => {
    try {
        const res = await api.questions.upvote(questionId, accessToken);

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));

            if (res.status === 403) {
                toast.error('You need at least 15 reputation to upvote');
                throw new Error('Insufficient reputation');
            }

            console.error('Server error details:', errorData);
            throw new Error(errorData.message || 'Upvote failed');
        }

        return await res.json();

    } catch (error) {
        if (error instanceof Error) {
            toast.error(error.message);
        }
        throw error;
    }
};

export const downvoteQuestion = async (
    questionId: number,
    accessToken: string
): Promise<string> => {
    try {
        const res = await api.questions.downvote(questionId, accessToken);

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));

            if (res.status === 403) {
                toast.error('You need at least 125 reputation to downvote');
                throw new Error('Insufficient reputation');
            }

            console.error('Server error details:', errorData);
            throw new Error(errorData.message || 'Downvote failed');
        }

        return await res.json();

    } catch (error) {
        if (error instanceof Error ) {
            toast.error(error.message);
        }
        throw error;
    }
};