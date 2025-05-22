'use client'
import { Editor } from '@/components/editor/Editor'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Github, Link, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useRef, useState } from 'react'

export default function EditProfile() {
    const [username , setUsername] = useState('Chaymae Bouti')
    const [country , setCountry] = useState('')
    const [title , setTitle] = useState('')
    const [editorContent, setEditorContent] = useState('')
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [avatarImage, setAvatarImage] = useState('https://github.com/shadCN.png')

    const router = useRouter()

    const handleAvatarClick = () => {
        fileInputRef.current?.click()
    }
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const imageUrl = URL.createObjectURL(file)
            setAvatarImage(imageUrl)
        }
    }
  return (
    <div className='flex flex-col p-5'>
        <h1 className='font-bold text-textPrimary mb-2'>Personal informations</h1>
        <div className='flex flex-col gap-5 bg-backgroundSecondary border border-borderColor rounded-[10px] p-3 mb-5'>
            <div className='flex flex-col relative'>
                <h1 className='text-sm mb-2'> Profile Image</h1>
            <Avatar className="rounded-[0] w-[20vh] h-[20vh] sm:w-[25vh] sm:h-[25vh]">
                        <AvatarImage src={avatarImage} />
                        <AvatarFallback>JN</AvatarFallback>
                    </Avatar>
                    <Button onClick={handleAvatarClick} variant='outline' className='cursor-pointer bg-buttons text-xs text-backgroundPrimary rounded-[0] w-[20vh]  sm:w-[25vh] absolute bottom-0'>
                        Change picture
                    </Button>
                     <input 
                        type="file" 
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                    />
            </div>

            <div className='flex flex-col'>
                <h1 className='text-sm mb-2'> Display Name</h1>
                <Input type='text' value={username} onChange={(e)=>setUsername(e.target.value)} placeholder={username} className='border border-borderColor  bg-backgroundSecondary rounded-[10px] w-1/2 ' />
            </div>
            <div className='flex flex-col'>
                <h1 className='text-sm mb-2'> Country</h1>
                <Input type='text' value={country} onChange={(e)=>setCountry(e.target.value)} placeholder={country} className='border border-borderColor  bg-backgroundSecondary rounded-[10px] w-1/2 ' />
            </div>
            <div className='flex flex-col'>
                <h1 className='text-sm mb-2'> Title</h1>
                <Input type='text' value={title} onChange={(e)=>setTitle(e.target.value)} placeholder='No title has been set yet' className='border border-borderColor  bg-backgroundSecondary rounded-[10px] w-1/2 ' />
            </div>
            <div className='flex flex-col'>
                <h1 className='text-sm mb-2'> About Me</h1>
                <Editor onSave={setEditorContent}/>
                </div>

        </div>
        <h1 className='font-bold text-textPrimary mb-2'>Links</h1>
        <div className='flex flex-col md:flex-row justify-between bg-backgroundSecondary border border-borderColor rounded-[10px] p-3 mb-5 space-y-4 md:space-y-0 md:space-x-4'>
    <div className='flex flex-col flex-1'>
        <h1 className='text-sm mb-2'>Website link</h1>
        <div className='relative flex border border-borderColor items-center p-1 bg-backgroundSecondary rounded-[10px]'>
            <Link className='text-buttons'/>
            <Input type='text' className='flex-1 border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none' />
        </div>
    </div>
    
    <div className='flex flex-col flex-1'>
        <h1 className='text-sm mb-2'>X link or username</h1>
        <div className='relative flex border border-borderColor items-center p-1 bg-backgroundSecondary rounded-[10px]'>
            <X className='text-buttons'/>
            <Input type='text' className='flex-1 border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none' />
        </div>
    </div>
    
    <div className='flex flex-col flex-1'>
        <h1 className='text-sm mb-2'>GitHub link or username</h1>
        <div className='relative flex border border-borderColor items-center p-1 bg-backgroundSecondary rounded-[10px]'>
            <Github className='text-buttons'/>
            <Input type='text' className='flex-1 border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none' />
        </div>
    </div>
</div>

        <div className='flex gap-3'>
            <Button className='cursor-pointer bg-buttons text-backgroundPrimary rounded-[10px] hover:bg-backgroundSecondary hover:border shadow-none hover:border-buttons hover:text-buttons w-fit mt-4'>Save</Button>
            <Button onClick={()=>router.push('/profile')} className='shadow-none cursor-pointer text-buttons hover:bg-backgroundSecondary w-fit mt-4 '>Cancel</Button>
        </div>
        
    </div>
  )
}
