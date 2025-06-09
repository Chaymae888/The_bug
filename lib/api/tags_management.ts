import {api} from "@/lib/api/endpoints";
import {Tag} from "@/types/tag";
import {Question} from "@/types/question";

    export const getTags= async ():Promise<Tag[]> => {
    const res = await api.tags.get();

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('Server error details:', errorData);
        throw new Error(errorData.message || 'get tag list failed');
    }
    return await res.json();
    
}
export const followTag = async (tagId: number, accessToken: string): Promise<string> => {
    const res = await api.tags.follow(tagId, accessToken);

    if (!res.ok) {
        // Try to parse error as JSON first, fallback to text
        const errorText = await res.text();
        let errorMessage = 'Follow tag failed';

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

export const unfollowTag = async (tagId: number, accessToken: string): Promise<string> => {
    const res = await api.tags.unfollow(tagId, accessToken);

    if (!res.ok) {
        // Try to parse error as JSON first, fallback to text
        const errorText = await res.text();
        let errorMessage = 'Unfollow tag failed';

        try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.message || errorMessage;
        } catch {
            errorMessage = errorText || errorMessage;
        }

        console.error('Server error:', errorMessage);
        throw new Error(errorMessage);
    }

    // Success case: Return the response text
    return await res.text();
};

export const getFollowedTags= async (accessToken:string):Promise<Tag[]> => {
    const res = await api.tags.getFollowings(accessToken);

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('Server error details:', errorData);
        throw new Error(errorData.message || 'get followed tags list failed');
    }
    return await res.json();

}

export const getQuestionsByTagName=async (tagName:string):Promise<Question[]>=>{
        const res = await api.tags.getQuestions(tagName);
        if(!res.ok){
            const errorData= await res.json().catch(()=>({}));
            console.error('Server error details ', errorData);
            throw new Error (errorData.message|| 'get questions list failed ')
        }
        return await res.json();
}
export const getTag=async(tagName:string):Promise<Tag>=>{
    const res=await api.tags.getTag(tagName);
    if(!res.ok){
        const errorData= await res.json().catch(()=>({}));
        console.error('Server error details ', errorData);
        throw new Error (errorData.message|| 'get tag failed ')
    }
    return await res.json();
}
