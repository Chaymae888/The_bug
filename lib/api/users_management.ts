import {api} from "@/lib/api/endpoints";
import {User} from "@/types/user";



export const getUsers= async ():Promise<User[]> => {
    const res = await api.users.get();

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('Server error details:', errorData);
        throw new Error(errorData.message || 'get user list failed');
    }
    return await res.json();

}
export const followUser=async (userId: number, accessToken: string):Promise<string> => {
    const res = await api.users.follow(userId, accessToken);
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('Server error details:', errorData);
        throw new Error(errorData.message || 'follow user failed');
    }
    return await res.json();
}

export const unfollowUser=async (userId: number, accessToken: string):Promise<string> => {
    const res = await api.users.unfollow(userId, accessToken);
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('Server error details:', errorData);
        throw new Error(errorData.message || 'unfollow user failed');
    }
    return await res.json();
}