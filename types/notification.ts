export interface Notification{
    id: number,
    message: string,
    type: string,
    referenceId: number,
    isRead: boolean,
    timestamp: number,
    userId: number,
    username: string,
}