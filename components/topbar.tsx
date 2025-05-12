'use client'
import React from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Search, Sun, Moon } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
import SearchInput from './search-input'
import Link from 'next/link'

const Topbar = () => {
  const { theme, toggleTheme } = useTheme()
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
        <Link href="/login" passHref>
          <Button type='submit' className='bg-backgroundSecondary text-buttons border border-buttons rounded-full hover:bg-buttonsHover'>Login</Button>
        </Link>
        <Link href="/signup" passHref>
          <Button type='submit' className='bg-buttons text-white rounded-full hover:bg-buttonsHover'>Sign-in</Button>
        </Link>
      </div>
    </div>
  )
}

export default Topbar