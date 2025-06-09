import {api} from "@/lib/api/endpoints";
import {User} from "@/types/user";
import {Question} from "@/types/question";
import {Answer} from "@/types/answer";



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



export const getFollowings= async (userId:number):Promise<User[]> => {
    const res = await api.users.getFollowings(userId);

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('Server error details:', errorData);
        throw new Error(errorData.message || 'get followings list failed');
    }
    return await res.json();

}

export const getUserQuestions=async(userId:number):Promise<Question[]>=> {
    const res = await api.users.getQuestions(userId);

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('Server error details:', errorData);
        throw new Error(errorData.message || 'get questions list failed');
    }
    return await res.json();
}

export const getUserAnswers=async(userId:number):Promise<Answer[]>=>{
    const res = await api.users.getAnswers(userId);

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('Server error details:', errorData);
        throw new Error(errorData.message || 'get answers list failed');
    }
    return await res.json();
}

