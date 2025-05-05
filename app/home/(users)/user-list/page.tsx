import SearchInput from '@/components/search-input'
import { AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@radix-ui/react-avatar'
import React from 'react'

const UserList = () => {
  const users = [
    {
      profileImage: 'https://github.com/shadCN.png',
      userName: 'John Doe',
      userJob: 'Software Engineer',
      userCountry: 'USA',
      numberoffollowers: 1000,
      goodAt: ['javascript', 'python', 'java'],
      numberofVotes: 100,
      numberofEdits: 50,
    },
    {
      profileImage: 'https://github.com/shadCN.png',
      userName: 'John Doe',
      userJob: 'Software Engineer',
      userCountry: 'USA',
      numberoffollowers: 1000,
      goodAt: ['javascript', 'python', 'java'],
      numberofVotes: 100,
      numberofEdits: 50,
    }, {
      profileImage: 'https://github.com/shadCN.png',
      userName: 'John Doe',
      userJob: 'Software Engineer',
      userCountry: 'USA',
      numberoffollowers: 1000,
      goodAt: ['javascript', 'python', 'java'],
      numberofVotes: 100,
      numberofEdits: 50,
    }, {
      profileImage: 'https://github.com/shadCN.png',
      userName: 'John Doe',
      userJob: 'Software Engineer',
      userCountry: 'USA',
      numberoffollowers: 1000,
      goodAt: ['javascript', 'python', 'java'],
      numberofVotes: 100,
      numberofEdits: 50,
    }, {
      profileImage: 'https://github.com/shadCN.png',
      userName: 'John Doe',
      userJob: 'Software Engineer',
      userCountry: 'USA',
      numberoffollowers: 1000,
      goodAt: ['javascript', 'python', 'java'],
      numberofVotes: 100,
      numberofEdits: 50,
    }, {
      profileImage: 'https://github.com/shadCN.png',
      userName: 'John Doe',
      userJob: 'Software Engineer',
      userCountry: 'USA',
      numberoffollowers: 1000,
      goodAt: ['javascript', 'python', 'java'],
      numberofVotes: 100,
      numberofEdits: 50,
    }, {
      profileImage: 'https://github.com/shadCN.png',
      userName: 'John Doe',
      userJob: 'Software Engineer',
      userCountry: 'USA',
      numberoffollowers: 1000,
      goodAt: ['javascript', 'python', 'java'],
      numberofVotes: 100,
      numberofEdits: 50,
    }, {
      profileImage: 'https://github.com/shadCN.png',
      userName: 'John Doe',
      userJob: 'Software Engineer',
      userCountry: 'USA',
      numberoffollowers: 1000,
      goodAt: ['javascript', 'python', 'java'],
      numberofVotes: 100,
      numberofEdits: 50,
    },]
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
      <Avatar className='z-100 w-12 h-13 mt-1 transition-all duration-300 hover:w-16 hover:h-17 hover:-translate-y-1'>
          <AvatarImage className='rounded-[4px]' src={user.profileImage} />
          <AvatarFallback className='text-xs'>JN</AvatarFallback>
        </Avatar>
      <div className='flex flex-col ml-2 text-sm'>
        <h1 className='text-buttons font-medium'>{user.userName}</h1>
        <h1 className="text-textSecondary">{user.userCountry}</h1>
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