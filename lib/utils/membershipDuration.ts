export function calculateMembershipDuration(creationDate: string): string {
    const now = new Date();
    const date = new Date(creationDate);
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays >= 365) {
        const years = Math.floor(diffInDays / 365);
        return `Member for  ${years} year${years > 1 ? 's' : ''}`;
    } else if (diffInDays >= 30) {
        const months = Math.floor(diffInDays / 30);
        return `Member for  ${months} month${months > 1 ? 's' : ''}`;
    } else {
        return `Member for  ${diffInDays} day${diffInDays !== 1 ? 's' : ''}`;
    }
}
