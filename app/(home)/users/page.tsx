'use client'
import SearchInput from '@/components/search-input'
import { AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Avatar } from '@radix-ui/react-avatar'
import React, {useEffect, useState} from 'react'
import { useRouter } from 'next/navigation'
import { User } from '@/types/user'
import {getUsers} from "@/lib/api/users_management";


type SortMethod = 'followers' | 'reputation' | 'name';
const UserList = () => {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortMethod, setSortMethod] = useState<SortMethod>('followers');

  const sortUsers = (users: User[], method: SortMethod): User[] => {
    const sorted = [...users];
    switch (method) {
      case 'followers':
        return sorted.sort((a, b) => b.followersCount - a.followersCount);
      case 'reputation':
        return sorted.sort((a, b) => b.reputation - a.reputation);
      case 'name':
        return sorted.sort((a, b) => a.infoUser.username.localeCompare(b.infoUser.username));
      default:
        return sorted;
    }
  };

  const sortedUsers = sortUsers(users, sortMethod);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const fetchedUsers = await getUsers();
        setUsers(fetchedUsers);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch users:', err);
        setError(err instanceof Error ? err.message : 'Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);
  if (loading) {
    return <div>Loading users...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

    const handleClick = (user: User) => {
    sessionStorage.setItem('current-user', JSON.stringify(user));
    const urlSafeName = user.infoUser.username.toLowerCase()
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
          <h1
              className={`hover:bg-buttons hover:text-white text-textSecondary text-sm p-1 rounded-[5px] cursor-pointer ${
                  sortMethod === 'followers' ? 'bg-buttons text-white' : ''
              }`}
              onClick={() => setSortMethod('followers')}
          >Followers</h1>
          <h1
              className={`hover:bg-buttons hover:text-white text-textSecondary text-sm p-1 rounded-[5px] cursor-pointer ${
                  sortMethod === 'reputation' ? 'bg-buttons text-white' : ''
              }`}
              onClick={() => setSortMethod('reputation')}
          >Reputation</h1>
          <h1
              className={`hover:bg-buttons hover:text-white text-textSecondary text-sm p-1 rounded-[5px] cursor-pointer ${
                  sortMethod === 'name' ? 'bg-buttons text-white' : ''
              }`}
              onClick={() => setSortMethod('name')}
          >Name</h1></div>
      </div>
      <div className='flex flex-wrap gap-2 py-4'>
  {sortedUsers.map((user, index) => (
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
          <AvatarImage className='rounded-[4px]' src={user.photoUrl} />
          <AvatarFallback className='text-xs'>JN</AvatarFallback>
        </Avatar>
      <div className='flex flex-col ml-2 text-sm'>
        <h1 className='text-buttons font-medium'>{user.infoUser.username}</h1>
        <h1 className="text-textSecondary">{user.country}</h1>
        <h1 className="text-textSecondary">
          {user.followersCount?.toLocaleString() ?? '0'} followers
        </h1>

      </div>
    </div>
  ))}
</div></div>)
}

export default UserList