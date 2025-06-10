'use client'
import React from 'react'
import { Button } from './ui/button'
import {  Sun, Moon } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
import SearchInput from './search-input'
import Link from 'next/link'

import NoteIcon from './noteicon'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useAuthStore  } from "@/lib/stores/useAuthStore"

const Topbar = () => {
  const { theme, toggleTheme } = useTheme()
  const {isAuthenticated , user ,hydrated}=useAuthStore()
    if (!hydrated) {
        return null; // Or a loading skeleton
    }

  return (
    <div className='relative bg-backgroundSecondary w-full top-0 left-0 h-16 border border-borderColor flex items-center justify-between px-4 '>
      <SearchInput placeholder='Search for a question' />
      <div className='flex items-center gap-2'>
        <button
          onClick={toggleTheme}
          className="rounded-full bg-backgroundSecondary text-buttons dark:text-buttons p-2"
          aria-label="Toggle dark mode"
        >
          {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
        </button>
        {isAuthenticated ? (<div className='flex items-center justify-center gap-2 '>
          <Link
            id="open_msg_box"
            className="hasnotifications nav-link relative" href="/notifications">
            <NoteIcon className="w-6 h-6" opacityColor='#B1B1B1' color='#38A3A5' />
            <span className="pulse right-[13px]" />{" "}
          </Link>

          <div className='flex flex-col items-end text-sm'>
            <h1 >{user?.infoUser.username}</h1>
            <h1 className='text-gray-500'> {user?.infoUser.email}</h1>
          </div>
          <Link href="/profile" passHref>
            <Avatar className="cursor-pointer h-[7vh] w-[7vh] rounded-[10px]">
              <AvatarImage src='https://github.com/shadCN.png' />
              <AvatarFallback>JN</AvatarFallback>
            </Avatar>
          </Link>


        </div>) : (<div className='flex items-center gap-2'>
          <Link href="/login" passHref>
            <Button type='submit' className='bg-backgroundSecondary text-buttons border border-buttons rounded-full hover:bg-buttonsHover'>Login</Button>
          </Link>
          <Link href="/signup" passHref>
            <Button type='submit' className='bg-buttons text-white rounded-full hover:bg-buttonsHover'>Sign-in</Button>
          </Link>
        </div>)}

      </div>
    </div>
  )
}

export default Topbar