'use client'

import React from 'react'
import { Input } from './ui/input'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils/utils'
interface SearchInputProps {
    placeholder?: string
    className?: string
  }

const SearchInput = ({className, placeholder}:SearchInputProps) => {
  return (
    <div className={cn('relative w-1/3', className)}>
      <button 
        type='button'  
        className='absolute right-3 top-1/2 transform -translate-y-1/2'
      >
        <Search className='text-textSecondary' />
      </button>
      <Input 
        id='search' 
        placeholder={placeholder}
        className={cn('border-0 focus-visible:border-0 rounded-full ',
            'focus-visible:ring-0 bg-backgroundPrimary ',
            'placeholder:text-textSecondary w-full overflow-hidden whitespace-nowrap text-ellipsis pr-10',
          )} 
          
      />
    </div>
  )
}

export default SearchInput