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


export const followQuestion = async (questionId: number, accessToken: string): Promise<string> => {
    const res = await api.questions.follow(questionId, accessToken);

    if (!res.ok) {
        // Try to parse error as JSON first, fallback to text
        const errorText = await res.text();
        let errorMessage = 'Follow question failed';

        try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.message || errorMessage;
        } catch {
            errorMessage = errorText || errorMessage;
        }

        console.error('Server error:', errorMessage);
        throw new Error(errorMessage);
    }

    return await res.text();
};

export const unfollowQuestion = async (questionId: number, accessToken: string): Promise<string> => {
    const res = await api.questions.unfollow(questionId, accessToken);

    if (!res.ok) {
        const errorText = await res.text();
        let errorMessage = 'Unfollow question failed';

        try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.message || errorMessage;
        } catch {
            errorMessage = errorText || errorMessage;
        }

        console.error('Server error:', errorMessage);
        throw new Error(errorMessage);
    }

    return await res.text();
};

export const getFollowedQuestions= async (accessToken:string):Promise<Question[]> => {
    const res = await api.questions.getFollowings(accessToken);

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('Server error details:', errorData);
        throw new Error(errorData.message || 'get followed questions list failed');
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
            const errorText = await res.text(); // Read as text first
            if (res.status === 403) {
                toast.error('You need at least 15 reputation to upvote');
                return "";
            }

            // Try parsing as JSON (if error is structured)
            let errorMessage = 'Upvote failed';
            try {
                const errorData = JSON.parse(errorText);
                errorMessage = errorData.message || errorMessage;
            } catch {
                errorMessage = errorText || errorMessage;
            }

            throw new Error(errorMessage);
        }

        return await res.text(); // Assume plain text response

    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
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
            const errorText = await res.text(); // Read as text first
            if (res.status === 403) {
                toast.error('You need at least 125 reputation to downvote');
                return "";
            }

            // Try parsing as JSON (if error is structured)
            let errorMessage = 'Downvote failed';
            try {
                const errorData = JSON.parse(errorText);
                errorMessage = errorData.message || errorMessage;
            } catch {
                errorMessage = errorText || errorMessage;
            }

            throw new Error(errorMessage);
        }

        return await res.text(); // Assume plain text response

    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            toast.error(error.message);
        }
        throw error;
    }
};

interface Voter {
    userId : number,
    voteType : string
}

export const getVoters= async (questionId:number):Promise<Voter[]> => {
    const res = await api.questions.getVoters(questionId);

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('Server error details:', errorData);
        throw new Error(errorData.message || 'get voters list failed');
    }
    return await res.json();

}

export const getQuestion=async (questionId:number):Promise<Question>=>{
    const res = await api.questions.getQuestion(questionId);
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('Server error details:', errorData);
        throw new Error(errorData.message || 'get  question  failed');
    }
    return await res.json();
}