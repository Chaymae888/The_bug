'use client'
import SearchInput from '@/components/search-input'
import { AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Avatar } from '@radix-ui/react-avatar'
import React from 'react'
import { useRouter } from 'next/navigation'
import { User } from '@/types/user'

const UserList = () => {
  const router = useRouter()
  const users: User[] = [
    {
      image: 'https://github.com/shadCN.png',
      username: 'John Doe',
      job: 'Software Engineer',
      country: 'USA',
      numberoffollowers: 1000,
      goodAt: ['javascript', 'python', 'java'],
      numberofVotes: 100,
      numberofEdits: 50,
      memberfor: '2 years',
      lastseen: '1 hour ago',
      reputation: 1500,
      about: 'Passionate developer.',
      links: [],
      answers: 0,
      questions: 0
    },
    {
      image: 'https://github.com/shadCN.png',
      username: 'Jane Smith',
      job: 'Frontend Developer',
      country: 'Canada',
      numberoffollowers: 800,
      goodAt: ['typescript', 'react', 'css'],
      numberofVotes: 80,
      numberofEdits: 40,
      memberfor: '1 year',
      lastseen: '2 hours ago',
      reputation: 1200,
      about: 'UI/UX enthusiast.',
      links: [],
      answers: 0,
      questions: 0
    },
    {
      image: 'https://github.com/shadCN.png',
      username: 'Alice Johnson',
      job: 'Backend Developer',
      country: 'UK',
      numberoffollowers: 600,
      goodAt: ['nodejs', 'express', 'mongodb'],
      numberofVotes: 60,
      numberofEdits: 30,
      memberfor: '3 years',
      lastseen: '3 hours ago',
      reputation: 1100,
      about: 'API specialist.',
      links: [],
      answers: 0,
      questions: 0
    },
    {
      image: 'https://github.com/shadCN.png',
      username: 'Bob Lee',
      job: 'Full Stack Developer',
      country: 'Australia',
      numberoffollowers: 900,
      goodAt: ['python', 'django', 'react'],
      numberofVotes: 90,
      numberofEdits: 45,
      memberfor: '4 years',
      lastseen: '4 hours ago',
      reputation: 1400,
      about: 'Loves building products.',
      links: [],
      answers: 0,
      questions: 0
    },
    {
      image: 'https://github.com/shadCN.png',
      username: 'Charlie Brown',
      job: 'DevOps Engineer',
      country: 'Germany',
      numberoffollowers: 700,
      goodAt: ['aws', 'docker', 'kubernetes'],
      numberofVotes: 70,
      numberofEdits: 35,
      memberfor: '2 years',
      lastseen: '5 hours ago',
      reputation: 1300,
      about: 'Cloud and automation.',
      links: [],
      answers: 0,
      questions: 0
    },
    {
      image: 'https://github.com/shadCN.png',
      username: 'Diana Prince',
      job: 'QA Engineer',
      country: 'France',
      numberoffollowers: 500,
      goodAt: ['testing', 'cypress', 'jest'],
      numberofVotes: 50,
      numberofEdits: 25,
      memberfor: '1 year',
      lastseen: '6 hours ago',
      reputation: 1000,
      about: 'Quality matters.',
      links: [],
      answers: 0,
      questions: 0
    },
    {
      image: 'https://github.com/shadCN.png',
      username: 'Eve Adams',
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
    },
  ]

    const handleClick = (user: User) => {
    sessionStorage.setItem('current-user', JSON.stringify(user));
    const urlSafeName = user.username.toLowerCase()
      .replace(/\s+/g, '-')       
      .replace(/[^a-z0-9-]/g, '');
    router.push(`/users/${urlSafeName}`);
  };
  return (
    <div className='p-4 flex flex-col'>
      <h1 className='text-[50px] pb-4 text-textPrimary'>Users</h1>
      <div className='flex justify-between items-center'>
        <SearchInput placeholder='Filter by user name' className='w-50 border border-textSecondary rounded-full' />
        <div className=' border border-textSecondary w-50 h-8 rounded-[5px] flex items-center justify-around '>
          <h1 className='hover:bg-buttons hover:text-white text-textSecondary text-sm p-1 rounded-[5px]'>Reputation</h1>
          <h1 className='hover:bg-buttons hover:text-white text-textSecondary text-sm p-1 rounded-[5px]'>Voters</h1>
          <h1 className='hover:bg-buttons hover:text-white text-textSecondary text-sm p-1 rounded-[5px]'>Editors</h1>
        </div>
      </div>
      <div className='flex flex-wrap gap-2 py-4'>
  {users.map((user, index) => (
    <div 
      key={index} 
      className=' p-2 flex items-start flex-grow w-[calc(50%-8px)] 
        md:max-w-[calc(25%-8px)] md:min-w-[150px]
        relative overflow-hidden
        before:content-[""] before:absolute before:top-0 before:left-0
        before:w-0 before:h-0 before:bg-blue-200/20
        before:transition-[width,height] before:duration-300
        hover:before:w-full hover:before:h-full '
    >
      <Avatar onClick={() => handleClick(user)} className='z-100 w-12 h-13 mt-1 transition-all duration-300 hover:w-16 hover:h-17 hover:-translate-y-1'>
          <AvatarImage className='rounded-[4px]' src={user.image} />
          <AvatarFallback className='text-xs'>JN</AvatarFallback>
        </Avatar>
      <div className='flex flex-col ml-2 text-sm'>
        <h1 className='text-buttons font-medium'>{user.username}</h1>
        <h1 className="text-textSecondary">{user.country}</h1>
        <h1 className="text-textSecondary">
          {user.numberoffollowers?.toLocaleString() ?? '0'} followers
        </h1>
        <div className="text-buttons text-xs">
          {user.goodAt.map((tag, i) => (
            <span key={tag}>
              {tag}
              {i !== user.goodAt.length - 1 && ', '}
            </span>
          ))}
        </div>
      </div>
    </div>
  ))}
</div></div>)
}

export default UserList