'use client'
import SelectItem from '@/components/SelectItem'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Cake } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import {useParams, useRouter} from 'next/navigation'
import { User } from '@/types/user'
import { Separator } from '@/components/ui/separator'
import {useAuthStore} from "@/lib/stores/useAuthStore";
import {followUser, getUserAnswers, getUserQuestions, unfollowUser} from "@/lib/api/users_management";
import {toast} from "sonner";
import {handleRequireLogin} from "@/lib/utils/authUtils";
import {Question} from "@/types/question";
import {Answer} from "@/types/answer";
import {getQuestion} from "@/lib/api/questions_management";
import {calculateMembershipDuration} from "@/lib/utils/membershipDuration";

export default function UserPage() {
    const [activeTab, setActiveTab] = useState<'profile' | 'activity'>('profile')
    const [activity, setActivity] = useState<'answers' | 'questions' >('questions')
    const [currentUser, setCurrentUser] = useState<User | null>(null)
    const params = useParams();
    const [activityData, setActivityData] = useState<{
        questions: Question[],
        answers: Answer[]
    }>({ questions: [], answers: [] });

    const {isAuthenticated,  accessToken, user,setFollowings,followings} = useAuthStore()



    const router = useRouter()



    useEffect(() => {
        const fetchUserData = async () => {
            const storedUser = sessionStorage.getItem('current-user')
            if (storedUser) {
                setCurrentUser(JSON.parse(storedUser))
                return
            }
        }
        fetchUserData()
    }, [params?.username])

    useEffect(() => {
        const fetchData = async () => {
            if (!currentUser) return;

            try {
                const fetchedUserQuestions = await getUserQuestions(currentUser.userId)
                const fetchedUserAnswers = await getUserAnswers(currentUser.userId)
                setActivityData({
                    questions: fetchedUserQuestions,
                    answers: fetchedUserAnswers
                });

            } catch (err) {
                console.error('Failed to fetch data:', err);
            }
        };

        fetchData();
    }, [currentUser, user?.userId, accessToken, isAuthenticated]);
    const currentActivityData = activityData[activity]

    const togglefollowUser = async () => {
        try {
            if (!user) {
                console.error('No user logged in');
                return;
            }
            if (!accessToken) {
                console.error('Your session is expired you should login again');
                return;
            }
            if (!currentUser) {
                console.error('No user is defined');
                return;
            }

            const isFollowing = followings?.some(
                following => following.userId === currentUser.userId
            );

            if (isFollowing) {
                await unfollowUser(currentUser.userId, accessToken);
                setFollowings(followings?.filter(f => f.userId !== currentUser.userId) ?? null);
            } else {
                await followUser(currentUser.userId, accessToken);
                setFollowings([...(followings || []), currentUser]);
            }
        } catch (err) {
            console.error('Failed to toggle follow:', err);
            toast.error('Failed to toggle follow');
        }
    }

    const getQuestionTitle = async (questionId :number):Promise<string>=>{
        try{
            const question = await getQuestion(questionId);
            return question.title;

        }catch (error){
            toast.error(`failed to get the question of the answer because :${error} `)
            return "";
        }
    }


    return (
        <div className='flex flex-col p-4'>

            {user && (
                <div className='flex flex-col md:flex-row justify-between gap-4'>
                    <div className='flex flex-col sm:flex-row items-center gap-4'>
                        <Avatar className="cursor-pointer rounded-[10px] w-[20vh] h-[20vh] sm:w-[25vh] sm:h-[25vh]">
                            <AvatarImage src={user.photoUrl || 'https://github.com/shadCN.png'} />
                            <AvatarFallback>
                                {user.infoUser.username.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className='flex flex-col gap-2 text-center sm:text-left'>
                            <h1 className='text-2xl sm:text-4xl text-textPrimary'>{user.infoUser.username}</h1>
                            <div className='flex flex-col sm:flex-row gap-3 text-[#B1B1B1] justify-center sm:justify-start'>
                                <div className='flex items-center justify-center gap-1'>
                                    <Cake size={16} />
                                    <h1 className='text-sm'>{(currentUser && calculateMembershipDuration(currentUser?.createdDate))}</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex justify-center sm:justify-end'>
                        <Button variant="outline" className='cursor-pointer bg-buttons text-backgroundPrimary rounded-[10px]' onClick={() => {
                            if (isAuthenticated) {
                                togglefollowUser()
                            } else {
                                handleRequireLogin('follow someone', router);
                            }
                        }}>
                            {currentUser && followings?.includes(currentUser) ? 'Following' : 'Follow'}
                        </Button>
                    </div>
                </div>
            )}

            {/* Navigation Tabs */}
            <div className='border border-textSecondary w-full sm:w-55 h-8 rounded-[5px] flex items-center justify-around mt-5'>
                <button
                    onClick={() => setActiveTab('profile')}
                    className={`cursor-pointer hover:bg-buttons hover:text-white text-textSecondary text-sm p-1 px-2 rounded-[5px] ${activeTab === 'profile' ? 'bg-buttons text-white' : ''
                        }`}
                >
                    Profile
                </button><button
                    onClick={() => setActiveTab('activity')}
                    className={`cursor-pointer hover:bg-buttons hover:text-white text-textSecondary text-sm p-1 px-2 rounded-[5px] ${activeTab === 'activity' ? 'bg-buttons text-white' : ''
                        }`}
                >
                    Activity
                </button></div>

            {/* Stats and About Section */}
            <div className='py-4'>
                {activeTab === 'profile' && (
                    <div className='flex flex-col lg:flex-row gap-5 '>
                        {/* Stats Section */}
                        <div className='flex flex-col w-full lg:w-auto'>
                            <h1 className='text-xl'>Stats</h1>
                            <div className='flex bg-backgroundSecondary border border-borderColor rounded-[10px] p-2 gap-4 justify-around sm:justify-start'>
                                <div className='flex flex-col gap-3'>
                                    <div className='flex flex-col gap-1'>
                                        <h1>{currentUser?.reputation}</h1>
                                        <h1 className='text-[#B1B1B1]'>reputation</h1>
                                    </div>
                                    <div className='flex flex-col gap-1'>
                                        <h1>{currentUser?.answerCount}</h1>
                                        <h1 className='text-[#B1B1B1]'>answers</h1>
                                    </div>
                                </div>
                                <div className='flex flex-col gap-3'>
                                    <div className='flex flex-col gap-1'>
                                        <h1>{currentUser?.followersCount}</h1>
                                        <h1 className='text-[#B1B1B1]'>followers</h1>
                                    </div>
                                    <div className='flex flex-col gap-1'>
                                        <h1>{currentUser?.questionCount}</h1>
                                        <h1 className='text-[#B1B1B1]'>questions</h1>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col w-full'>
                            <h1 className='text-xl'>About</h1>
                            <div className='bg-backgroundSecondary border border-borderColor rounded-[10px] p-4 sm:px-36 sm:py-6 w-full'>
                                <h1 className='text-center'>about me section is currently blank. </h1>
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === 'activity' && (
                    <div >
                        <h1 className='text-sm mb-1 text-[#B1B1B1]'>View all activity pages</h1>
                        <SelectItem
                            items={['questions', 'answers']}
                            item={activity}
                            setItem={setActivity} />

                        <div className='mt-4 bg-backgroundSecondary border border-borderColor rounded-[10px] p-4'>
                            {currentActivityData.map((item, index) => (
                                <React.Fragment key={item.id}>
                                  {index > 0 && <Separator className="bg-blue-50" />}
                                  <div className='flex  px-4 py-2 items-center gap-2'>
                                    <h1 className='font-medium px-4 py-2 border rounded-[10px] text-backgroundSecondary bg-buttons text-center '>{item.voteScore}</h1>
                                    <h1 className='font-medium text-sm  text-textSecondary hover:text-buttons underline line-clamp-2 cursor-pointer '>  {('questionId' in item) ? getQuestionTitle(item.questionId) : item.title}</h1>
                                  </div>
                    
                                </React.Fragment>
                              ))}
                        </div>
                    </div>
                )}
            </div>


        </div>
    )
}
