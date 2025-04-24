'use client'
import React from 'react'
import { Input } from './ui/input'
import {Button} from './ui/button'
import { Search ,Sun, Moon } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'

const Topbar = () => {
  const { theme, toggleTheme } = useTheme()
  return (
    <div className='relative bg-backgroundSecondary w-full top-0 left-0 h-16 border border-borderColor flex items-center justify-between px-4 '>
      <div className='relative'>
      <button type='button'  className='absolute right-3 top-1/2 transform -translate-y-1/2'>
                { <Search className='text-textSecondary' /> }
                </button>
              <Input id='search' placeholder='search something in the site ' className={'border-0 focus-visible:border-0 rounded-full focus-visible:ring-0 bg-backgroundPrimary placeholder:text-textSecondary w-100' } />
              
              </div>
              <div className='flex items-center gap-2'>
        <button 
          onClick={toggleTheme}
          className="rounded-full bg-backgroundSecondary text-buttons dark:text-buttons p-2"
          aria-label="Toggle dark mode"
        >
          {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
        </button>
        <Button type='submit' className='bg-backgroundSecondary text-buttons border border-buttons rounded-full hover:bg-buttonsHover'>Login</Button>
        <Button type='submit' className='bg-buttons text-white rounded-full hover:bg-buttonsHover'>Sign-in</Button>
      </div>
    </div>
  )
}

export default Topbar