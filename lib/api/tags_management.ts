import {api} from "@/lib/api/endpoints";
import {Tag} from "@/types/tag";

    export const getTags= async ():Promise<Tag[]> => {
    const res = await api.tags.get();

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('Server error details:', errorData);
        throw new Error(errorData.message || 'get tag list failed');
    }
    return await res.json();
    
}
export const followTag=async (tagId: number, accessToken: string):Promise<string> => {
    const res = await api.tags.follow(tagId, accessToken);
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('Server error details:', errorData);
        throw new Error(errorData.message || 'follow Tag failed');
    }
    return await res.json();
}

export const unfollowTag=async (tagId: number, accessToken: string):Promise<string> => {
    const res = await api.tags.unfollow(tagId, accessToken);
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('Server error details:', errorData);
        throw new Error(errorData.message || 'unfollow Tag failed');
    }
    return await res.json();
}
