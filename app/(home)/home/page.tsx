'use client';
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ThumbsUp, ThumbsDown, Edit, MailQuestion } from 'lucide-react'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { useRouter } from 'next/navigation'
import Link from 'next/link';
import { useAuthStore } from '@/lib/stores/useAuthStore';
import { handleRequireLogin } from '@/lib/utils/authUtils';



const Home = () => {
  const questions = [
    {
      id: 1,
      userImage: 'https://github.com/shadCN.png',
      username: 'John Doe',
      userJob: 'Software Engineer',
      userContributionsNumber: 1000,
      title: "How to use 0 More specifically, I am talking about Kubernetes pods, running different instances of the same application. I haven't found official recommendations for that scenario. Besides attaching a Persistent Volume, it feels like I need to also care about the race conditions.?",
      body: "Explication du probleme : Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown ....",
      numberofresponses: 5,
      numberofupvotes: 10,
      numberofdownvotes: 2,
      tags: ['react', 'javascript'],
    },
    {
      id: 2,
      userImage: 'https://github.com/shadCN.png',
      username: 'John Sina',
      userJob: 'Software Engineer',
      userContributionsNumber: 900,
      title: 'How to use React?',
      body: 'I am trying to learn React, but I am having trouble understanding how to use it. Can someone help me?',
      numberofresponses: 5,
      numberofupvotes: 10,
      numberofdownvotes: 2,
      tags: ['react', 'javascript'],
    },
    {
      id: 3,
      userImage: 'https://github.com/shadCN.png',
      username: 'John Whick',
      userJob: 'Software Engineer',
      userContributionsNumber: 500,
      title: 'How to use React?',
      body: 'I am trying to learn React, but I am having trouble understanding how to use it. Can someone help me?',
      numberofresponses: 5,
      numberofupvotes: 10,
      numberofdownvotes: 2,
      tags: ['react', 'javascript'],
    }
  ]
  const router = useRouter();
  const {isAuthenticated, hydrated}=useAuthStore()
  const [followings, setFollowings] = useState<string[]>([])

  if (!hydrated) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  

  const handleClick = (username: string) => {
      const urlSafeName = username.toLowerCase()
        .replace(/\s+/g, '-')       
        .replace(/[^a-z0-9-]/g, '');
      router.push(`/users/${urlSafeName}`);
    };

  return (
    <div className='flex flex-col md:flex-row'>

      <div className='flex flex-col md:w-2/3 p-5 h-screen'>
        <div className='flex justify-between'>
          <h1 className='font-bold text-textPrimary'>Newest questions </h1>
          <Button variant="outline" className='cursor-pointer bg-buttons text-backgroundPrimary rounded-full ' onClick={isAuthenticated ? () => { router.push('/questions/ask') } : () => { handleRequireLogin("ask a question", router) }}>Add a question</Button>
        </div>
        <div className='space-y-4 pt-4'>
          {questions.map((question) => (
            <div key={question.id} className='bg-backgroundSecondary shadow-md rounded-lg p-4'>
              <div className='flex justify-between'>
                <div className='flex items-center space-x-2'>
                  <Avatar onClick={()=>handleClick(question.username)} className="cursor-pointer">
                    <AvatarImage src={question.userImage} />
                    <AvatarFallback>JN</AvatarFallback>
                  </Avatar>

                  <div>
                    <p className='text-sm font-semibold'>{question.username}</p>
                    <p className='text-xs text-gray-500'>{question.userJob}</p>
                  </div>
                </div>
                <Button onClick={() =>{
    if (isAuthenticated) {
      setFollowings(prev => 
      prev.includes(question.username) 
        ? prev.filter(name => name !== question.username)  
        : [...prev, question.username]                     
    );
    } else {
      handleRequireLogin('follow someone',router);
    }
  }} className='cursor-pointer bg-backgroundSecondary text-buttons border border-buttons rounded-full hover:bg-buttons hover:text-backgroundPrimary'>{followings.includes(question.username) ?'Suivi(e)':'Suivre'}</Button>
              </div>

              <h2 className='pt-2 text-lg font-bold hover:text-buttons underline underline-offset-4 line-clamp-2 w-fit'>{question.title}</h2>
              <p className='text-sm pl-2 pt-1 text-gray-500 line-clamp-3'>{question.body}</p>
              <div className='flex  justify-between pt-2'>
                <h1 className='font-bold text-sm  text-textSecondary hover:text-buttons'>{question.numberofresponses} responses</h1>
                <div className='flex space-x-2'>
                  {question.tags.map((tag) => (
                    <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`}>
                      <Badge className='text-textSecondary bg-backgroundPrimary hover:bg-backgroundSecondary hover:text-backgroundSecondary hover:bg-buttons' >
                        {tag}
                      </Badge>
                    </Link>

                  ))}
                </div>
              </div>
              <div className='flex items-center space-x-2 pt-2'>
                <div className='w-fit h-8 bg-backgroundPrimary border border-borderColor rounded-lg flex items-center justify-center space-x-2 px-2'>
                  <ThumbsUp onClick={() => { isAuthenticated?()=>{}:handleRequireLogin('vote',router) }} className='hover:text-buttons cursor-pointer w-4 h-4 text-icons-primary' />
                  <span className='text-sm text-textSecondary'>{question.numberofupvotes}</span>
                  <Separator orientation='vertical' className='h-4 w-0 bg-borderColor' />
                  <ThumbsDown onClick={() => { isAuthenticated?()=>{}:handleRequireLogin('vote',router) }} className='hover:text-buttons cursor-pointer w-4 h-4 text-icons-primary' />
                  <span className='text-sm text-textSecondary'>{question.numberofdownvotes}</span>
                </div>
                <HoverCard><HoverCardTrigger>
                  <Edit onClick={() => { isAuthenticated?()=>{}:handleRequireLogin('answer a question',router) }} className='hover:text-buttons cursor-pointer w-6 h-6 text-textSecondary' /></HoverCardTrigger>
                  <HoverCardContent className='bg-backgroundSecondary w-fit h-fit border-borderColor '> Answer the question </HoverCardContent>
                </HoverCard>
                <HoverCard>
                  <HoverCardTrigger>
                    <MailQuestion onClick={() => { isAuthenticated?()=>{}:handleRequireLogin('follow a question',router) }} className='hover:text-buttons cursor-pointer w-6 h-6 text-textSecondary' />
                  </HoverCardTrigger>
                  <HoverCardContent className='bg-backgroundSecondary w-fit h-fit border-borderColor'> follow the question </HoverCardContent>
                </HoverCard>

              </div>
            </div>
          ))}
        </div>
      </div>
      <div className='hidden md:flex flex-col w-1/3 p-3 h-screen'>
        <h1 className='font-bold pb-2 text-textPrimary'>Top contributers</h1>
        <div className='flex flex-col space-y-4 py-4 px-3 bg-backgroundSecondary rounded-lg'>
          {questions.map((question, index) => (
            <React.Fragment key={question.id}>
              {index > 0 && <Separator className="bg-blue-50" />}
              <div className='flex justify-between'>
                <div className='flex items-center space-x-2'>
                  <Avatar onClick={()=>handleClick(question.username)} className="cursor-pointer">
                    <AvatarImage src={question.userImage} />
                    <AvatarFallback>JN</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className='text-sm font-semibold'>{question.username}</p>
                    <p className='text-xs text-gray-500'>{question.userJob}</p>
                  </div>
                </div>
                <h1 className='font-medium text-sm  text-textSecondary '>{question.userContributionsNumber} responses</h1>
              </div>

            </React.Fragment>
          ))}
        </div>
        <h1 className='font-bold pt-6 pb-2 text-textPrimary'>Top Questions</h1>
        <div className='flex flex-col space-y-4 py-4 px-3 bg-backgroundSecondary rounded-lg'>
          {questions.map((question, index) => (
            <React.Fragment key={question.id}>
              {index > 0 && <Separator className="bg-blue-50" />}
              <div className='flex items-center space-x-2'>
                <Avatar onClick={()=>handleClick(question.username)} className="cursor-pointer">
                  <AvatarImage src={question.userImage} />
                  <AvatarFallback>JN</AvatarFallback>
                </Avatar>
                <h1 className='text-sm hover:text-buttons underline underline-offset-4 line-clamp-2'>{question.title}</h1>
              </div>

            </React.Fragment>
          ))}
        </div>

      </div>
    </div>
  )
}

export default Home