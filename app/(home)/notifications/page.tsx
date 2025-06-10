'use client'
import React, {useEffect, useState} from "react";
import {Separator} from "@/components/ui/separator";
import {Trash2} from 'lucide-react';
import {Notification} from '@/types/notification'
import {useAuthStore} from "@/lib/stores/useAuthStore";
import {getNotifications} from "@/lib/api/notifications_management";
import {getQuestion} from "@/lib/api/questions_management";
import {toast} from "sonner";
import { useRouter } from "next/navigation";

const NotificationPage =()=>{
    const [notifications,setNotifications]=useState<Notification[]>([]);
    const {accessToken} = useAuthStore();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter()

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                setLoading(true);
                setError(null);
                if(accessToken){
                    const fetchedNotifications = await getNotifications(accessToken);
                    setNotifications(fetchedNotifications);
                }
                else {
                    setError("the access token is not defined relogin please")
                }
            } catch (err) {
                console.error('Failed to fetch data:', err);
                setError(err instanceof Error ? err.message : 'Failed to load data');
            } finally {
                setLoading(false);
            }
        };
        fetchNotifications();
    }, [accessToken]);
    if (loading) {
        return <div>Loading notifications...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }


    const handleClick= async (notification: Notification)=>{
        let questionId = 0;
        if(notification.type=='ANSWER'){
            try{
                const answer = await getAnswer(notification.referenceId);
                questionId=answer.questionId;

            }catch (error){
                toast.error(`failed to get the answer because :${error} `)
            }
        }
        else {
            if(notification.type=='QUESTION'){
                questionId=notification.referenceId;

            }
            else return;
        }
        try{
            const question = await getQuestion(questionId)
            sessionStorage.setItem(`question-${question.id}`, JSON.stringify(question));
            router.push(`/questions/${question.id}`);
        }catch (error){
            toast.error(`failed to get the question of the answer because :${error} `)
        }


    }

    return (
        <div className='flex flex-col p-5 h-screen'>
            <h1 className='font-bold text-textPrimary'>Your notifications </h1>
            <div className='mt-4 bg-backgroundSecondary border border-borderColor rounded-[10px] p-4'>
                {notifications.map((notification, index) => (
                    <React.Fragment key={notification.id}>
                        {index > 0 && <Separator className="bg-blue-50" />}
                        <div className='flex  justify-between px-4 py-2 items-center gap-2'>
                            <h1 onClick={()=>handleClick} className='font-medium text-sm  text-textSecondary hover:text-buttons underline line-clamp-2 cursor-pointer '>  {notification.message}</h1>
                            <Trash2 className='hover:text-buttons cursor-pointer w-4 h-4 text-icons-primary'/>
                        </div>

                    </React.Fragment>
                ))}
            </div>
        </div>
    )
}

export default NotificationPage;