'use client'
import SelectItem from '@/components/SelectItem'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Cake, Clock } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { User } from '@/types/user'
import { Separator } from '@/components/ui/separator'

export default function UserPage() {
    const [activeTab, setActiveTab] = useState<'profile' | 'activity'>('profile')
    const [activity, setActivity] = useState<'answers' | 'questions' | 'tags' | 'reputation'>('questions')
    const [user, setUser] = useState<User | null>(null)
    const [isFollowing, setIsFollowing] = useState(false)
    const params = useParams();


  const activityData = {
        questions: user?.questions,
        answers: user?.answers,
        tags: user?.tags,
        reputation: user?.reputation
    }

    // Get the current data based on selected activity
    const currentActivityData = activityData[activity]


    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const storedUser = sessionStorage.getItem('current-user')
                if (storedUser) {
                    setUser(JSON.parse(storedUser))
                    return
                }

                // If no sessionStorage, check URL params
                if (!params?.username) {
                    throw new Error('Username not specified in URL')
                }

                const username = Array.isArray(params.username)
                    ? params.username[0]
                    : params.username

                // Convert URL-safe name back to original
                const originalName = username.replace(/-/g, ' ')

                // Fallback to API fetch if needed
                const response = await fetch(`/api/users/${encodeURIComponent(originalName)}`)
                if (!response.ok) {
                    setUser({
                        username: username,
                        image: '',
                        job: 'Data Scientist',
                        country: 'India',
                        numberoffollowers: 400,
                        goodAt: ['python', 'pandas', 'machine learning'],
                        numberofVotes: 40,
                        numberofEdits: 20,
                        memberfor: '1 year',
                        lastseen: '6 hours ago',
                        reputation: 1000,
                        about: 'Quality matters.',
                        links: [],
                        answers: 0,
                        questions: 0
                    })
                }

            } catch (err) {
                console.error('Error fetching user data:', err)
                setUser(null) // Set user to null if there's an error
            }
        }

        fetchUserData()
    }, [params?.username])
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
                                    <h1 className='text-sm'>Member for</h1>
                                    <h1 className='text-sm'>1 year</h1>
                                </div>
                                <div className='flex items-center justify-center gap-1'>
                                    <Clock size={16} />
                                    <h1 className='text-sm'>Last seen</h1>
                                    <h1 className='text-sm'>1 year</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex justify-center sm:justify-end'>
                        <Button variant="outline" className='cursor-pointer bg-buttons text-backgroundPrimary rounded-[10px]' onClick={() => setIsFollowing(!isFollowing)}>
                            {isFollowing ? 'Following' : 'Follow'}
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
                                        <h1>{user?.reputation}</h1>
                                        <h1 className='text-[#B1B1B1]'>reputation</h1>
                                    </div>
                                    <div className='flex flex-col gap-1'>
                                        <h1>{user?.answerCount}</h1>
                                        <h1 className='text-[#B1B1B1]'>answers</h1>
                                    </div>
                                </div>
                                <div className='flex flex-col gap-3'>
                                    <div className='flex flex-col gap-1'>
                                        <h1>0</h1>
                                        <h1 className='text-[#B1B1B1]'>reached</h1>
                                    </div>
                                    <div className='flex flex-col gap-1'>
                                        <h1>{user?.questionCount}</h1>
                                        <h1 className='text-[#B1B1B1]'>questions</h1>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* About Section */}
                        <div className='flex flex-col w-full'>
                            <h1 className='text-xl'>About</h1>
                            <div className='bg-backgroundSecondary border border-borderColor rounded-[10px] p-4 sm:px-36 sm:py-6 w-full'>
                                <h1 className='text-center'>Your about me section is currently blank. Would you like to add one? Edit profile</h1>
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === 'activity' && (
                    <div >
                        <h1 className='text-sm mb-1 text-[#B1B1B1]'>View all activity pages</h1>
                        <SelectItem
                            items={['questions', 'answers', 'tags', 'reputation']}
                            item={activity}
                            setItem={setActivity} />

                        <div className='mt-4 bg-backgroundSecondary border border-borderColor rounded-[10px] p-4'>
                            {currentActivityData.map((item, index) => (
                                <React.Fragment key={item.id}>
                                  {index > 0 && <Separator className="bg-blue-50" />}
                                  <div className='flex  px-4 py-2 items-center gap-2'>
                                    <h1 className='font-medium px-4 py-2 border rounded-[10px] text-backgroundSecondary bg-buttons text-center '>{item.numberofresponses}</h1>
                                    <h1 className='font-medium text-sm  text-textSecondary hover:text-buttons underline line-clamp-2 cursor-pointer '>{item.title}</h1>
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
