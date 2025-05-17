'use client'
import SelectItem from '@/components/SelectItem'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Cake, Clock } from 'lucide-react'
import React, { useState } from 'react'

export default function Profile() {
    const [activeTab, setActiveTab] = useState<'profile' | 'activity' | 'followings'>('profile')
    const [activity, setActivity] = useState<'answers' | 'questions' | 'tags' | 'reputation'>('questions')
    const [following,setFollowing] = useState<'questions' | 'users' | 'tags'>('questions')

    return (
        <div className='flex flex-col p-4'>
            {/* Profile Header */}
            <div className='flex flex-col md:flex-row justify-between gap-4'>
                <div className='flex flex-col sm:flex-row items-center gap-4'>
                    <Avatar className="cursor-pointer rounded-[10px] w-[20vh] h-[20vh] sm:w-[25vh] sm:h-[25vh]">
                        <AvatarImage src='https://github.com/shadCN.png' />
                        <AvatarFallback>JN</AvatarFallback>
                    </Avatar>
                    <div className='flex flex-col gap-2 text-center sm:text-left'>
                        <h1 className='text-2xl sm:text-4xl text-textPrimary'>Chaymae Bouti</h1>
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
                    <Button variant="outline" className='cursor-pointer bg-buttons text-backgroundPrimary rounded-[10px]'>
                        Edit profile
                    </Button>
                </div>
            </div>

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
                </button><button
                    onClick={() => setActiveTab('followings')}
                    className={`cursor-pointer hover:bg-buttons hover:text-white text-textSecondary text-sm p-1 px-2 rounded-[5px] ${activeTab === 'followings' ? 'bg-buttons text-white' : ''
                        }`}
                >
                    Followings
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
                                <h1>0</h1>
                                <h1 className='text-[#B1B1B1]'>reputation</h1>
                            </div>
                            <div className='flex flex-col gap-1'>
                                <h1>0</h1>
                                <h1 className='text-[#B1B1B1]'>answers</h1>
                            </div>
                        </div>
                        <div className='flex flex-col gap-3'>
                            <div className='flex flex-col gap-1'>
                                <h1>0</h1>
                                <h1 className='text-[#B1B1B1]'>reached</h1>
                            </div>
                            <div className='flex flex-col gap-1'>
                                <h1>0</h1>
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
              setItem={setActivity}/>

            <div className='mt-4 bg-backgroundSecondary border border-borderColor rounded-[10px] p-4'>
                <p className='text-center text-textSecondary'>You don't have any {activity} yet</p>
            </div>
          </div>
        )}

        {activeTab === 'followings' && (
          <div >
            <h1 className='text-sm mb-1 text-[#B1B1B1]'>View all following pages</h1>
            <SelectItem
            items={['questions', 'users', 'tags']}
              item={following}
              setItem={setFollowing}/>

            <div className='mt-4 bg-backgroundSecondary border border-borderColor rounded-[10px] p-4'>
                <p className='text-center text-textSecondary'>You haven't followed any {following} yet</p>
            </div>
          </div>
        )}
            </div>

            
        </div>
    )
}

