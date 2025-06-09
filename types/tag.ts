import {User} from "@/types/user";
import {Question} from "@/types/question";

export  interface Tag {
  id: number;
  name: string
  usageCount: number
  followersCount: number
}