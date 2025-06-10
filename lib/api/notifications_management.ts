import {api} from "@/lib/api/endpoints";

export const getNotifications= async (accessToken:string):Promise<Notification[]> => {
    const res = await api.notifications.get(accessToken);

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('Server error details:', errorData);
        throw new Error(errorData.message || 'get notification list failed');
    }
    return await res.json();
}