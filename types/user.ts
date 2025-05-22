export interface User {
  userId: number;
  infoUser: {
    userId: number;
    username: string;
    email: string;
  };
  reputation: number;
  photoUrl: string | null;
  confirmed: boolean;
}