import SearchInput from '@/components/search-input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import React from 'react'

const RoomList = () => {
    const rooms = [
        { name: 'Javascript', count: 2523456, description: 'For questions about programming in ECMAScript (JavaScript/JS)' },
        { name: 'Python', count: 2198456, description: 'Python is a multi-paradigm, dynamically typed, multipurpose programming language' },
        { name: 'Java', count: 1917456, description: 'Java is a high-level object-oriented programming language' },
        { name: 'C#', count: 1589456, description: 'C# is a high-level, statically typed, multi-paradigm programming language' },
        { name: 'Php', count: 1463456, description: 'PHP is a widely used, open source, general-purpose, multi-paradigm, interpreted scripting language' },
        { name: 'Html', count: 1347456, description: 'HTML (HyperText Markup Language) is the markup language for creating web pages' },
      ]
  return (
    <div className='p-4 flex flex-col '>
      <div className='flex items-center justify-between pb-4'>
      <h1 className='text-[50px] text-textPrimary'>Rooms</h1>
      <Button className='bg-buttons text-white rounded-full hover:bg-buttonsHover ml-4'>Add a room</Button>
      </div>
        
      <SearchInput placeholder='Filter by room name' className='w-50 border border-textSecondary rounded-full' />
            
    <div className='flex flex-wrap gap-2 py-4'>
        {rooms.map((room, index) => (
          <div key={index} className='bg-backgroundSecondary border border-borderColor rounded p-2 hover:shadow-md transition-shadow flex-grow w-[calc(50%-8px)] md:max-w-[calc(25%-8px)] md:min-w-[200px]' >
            <h1 className='text-textSecondary font-bold line-clamp-1 '>{room.name}</h1>
            <p className='text-gray-500 text-sm mb-2 line-clamp-2 pt-2'>{room.description}</p>
            <div className='text-textSecondary text-xs'>{room.count.toLocaleString()} questions</div>
            <div className='text-textSecondary text-xs'>{room.count.toLocaleString()} users</div>
          </div>
        ))}
      </div></div>)
}

export default RoomList


