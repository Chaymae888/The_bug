'use client'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Tag } from '@/types/tag'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Edit, MailQuestion, ThumbsDown, ThumbsUp } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { toast } from 'sonner'


export default function TagPage() {
  const params = useParams()
  const [tag, setTag] = useState<Tag | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isWatching, setIsWatching] = useState(false)

  const router = useRouter()

  const questions = [
    {
      id: 1,
      userImage: 'https://github.com/shadCN.png',
      userName: 'John Doe',
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
      userName: 'John Doe',
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
      userName: 'John Doe',
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
  const handleRequireLogin = (toastTitle: string) => {
    router.push('/login');
    setTimeout(() => {
      toast("You must be logged in to " + toastTitle + " on The Bug", {
        description: "Login here or create a new account",
      });
    }, 100);
  };


  useEffect(() => {
    const fetchTagData = async () => {
      try {
        // Verify we have params and params.name
        if (!params?.name) {
          throw new Error('Tag name not specified in URL');
        }

        // Convert URL-safe name back to original
        const originalName = Array.isArray(params.name)
          ? params.name[0].replace(/-/g, ' ')
          : params.name.replace(/-/g, ' ');

        // 1. Check sessionStorage first
        const storedTag = sessionStorage.getItem('current-tag');
        if (storedTag) {
          const parsedTag: Tag = JSON.parse(storedTag);
          if (parsedTag.name.toLowerCase() === originalName.toLowerCase()) {
            setTag(parsedTag);
            return;
          }
        }

        // 2. Fallback to API fetch
        const response = await fetch(`/api/tags/${encodeURIComponent(originalName)}`);
        if (!response.ok) throw new Error('Tag not found');

        const data = await response.json();
        setTag(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tag');
      } finally {
        setLoading(false);
      }
    };

    fetchTagData();
  }, [params?.name]);

  if (loading) return <div className='p-4'>Loading...</div>
  if (error) return <div className='p-4 text-red-500'>Error: {error}</div>
  if (!tag) return <div className='p-4'>Tag not found</div>

  return (
    <div className='flex flex-col p-4'>
      <div className='flex justify-between items-center'>
        <h1 className='text-[50px] text-textPrimary'>[{tag.name}]</h1>
        {isWatching && (
          <Button
            variant="outline"
            className='cursor-pointer bg-buttons text-white rounded-full hover:bg-buttonsHover'
            onClick={() => router.push('/questions/ask')}
          >
            Add a question
          </Button>
        )}
      </div>

      <p className='py-6 w-2/3 text-textPrimary'>{tag.description}</p>

      <Button
        onClick={() => setIsWatching(!isWatching)}
        className={`cursor-pointer rounded-[10px] w-fit mt-4 transition-colors ${isWatching
            ? 'bg-gray-200 text-gray-800 hover:bg-gray-300 border border-gray-300'
            : 'bg-buttons text-white hover:bg-buttonsHover'
          }`}
      >
        {isWatching ? 'Watching' : 'Watch tag'}
      </Button>
      <div className='flex flex-col w-full p-5 h-screen'>
        <div className='flex justify-between '>
          <h1 className='font-bold text-textPrimary'>{tag.count} questions </h1>
          <div className=' border border-textSecondary w-45 h-8 rounded-[5px] flex items-center justify-around '>
            <h1 className='hover:bg-buttons hover:text-white text-textSecondary text-sm p-1 rounded-[5px]'>Popular</h1>
            <h1 className='hover:bg-buttons hover:text-white text-textSecondary text-sm p-1 rounded-[5px]'>New</h1>
            <h1 className='hover:bg-buttons hover:text-white text-textSecondary text-sm p-1 rounded-[5px]'>Name</h1>
          </div>
        </div>
        <div className='space-y-4 pt-4'>
          {questions.map((question) => (
            <div key={question.id} className='bg-backgroundSecondary shadow-md rounded-lg p-4'>
              <div className='flex justify-between'>
                <div className='flex items-center space-x-2'>
                  <Avatar className="cursor-pointer">
                    <AvatarImage src={question.userImage} />
                    <AvatarFallback>JN</AvatarFallback>
                  </Avatar>

                  <div>
                    <p className='text-sm font-semibold'>{question.userName}</p>
                    <p className='text-xs text-gray-500'>{question.userJob}</p>
                  </div>
                </div>
                <Button onClick={() => { handleRequireLogin('follow someone') }} className='cursor-pointer bg-backgroundSecondary text-buttons border border-buttons rounded-full hover:bg-buttons hover:text-white'>Suivre</Button>
              </div>

              <h2 className='pt-2 text-lg font-bold hover:text-buttons underline underline-offset-4 line-clamp-2 w-fit'>{question.title}</h2>
              <p className='text-sm pl-2 pt-1 text-gray-500 line-clamp-3'>{question.body}</p>
              <h1 className='pt-2 font-bold text-sm  text-textSecondary hover:text-buttons'>{question.numberofresponses} responses</h1>

              <div className='flex items-center space-x-2 pt-2'>
                <div className='w-fit h-8 bg-backgroundPrimary border border-borderColor rounded-lg flex items-center justify-center space-x-2 px-2'>
                  <ThumbsUp onClick={() => { handleRequireLogin("add a vote") }} className='hover:text-buttons cursor-pointer w-4 h-4 text-icons-primary' />
                  <span className='text-sm text-textSecondary'>{question.numberofupvotes}</span>
                  <Separator orientation='vertical' className='h-4 w-0 bg-borderColor' />
                  <ThumbsDown onClick={() => { handleRequireLogin("add a vote") }} className='hover:text-buttons cursor-pointer w-4 h-4 text-icons-primary' />
                  <span className='text-sm text-textSecondary'>{question.numberofdownvotes}</span>
                </div>
                <HoverCard><HoverCardTrigger>
                  <Edit onClick={() => { handleRequireLogin("answer a question") }} className='hover:text-buttons cursor-pointer w-6 h-6 text-textSecondary' /></HoverCardTrigger>
                  <HoverCardContent className='bg-backgroundSecondary w-fit h-fit border-borderColor '> Answer the question </HoverCardContent>
                </HoverCard>
                <HoverCard>
                  <HoverCardTrigger>
                    <MailQuestion onClick={() => { handleRequireLogin("follow a question") }} className='hover:text-buttons cursor-pointer w-6 h-6 text-textSecondary' />
                  </HoverCardTrigger>
                  <HoverCardContent className='bg-backgroundSecondary w-fit h-fit border-borderColor'> follow the question </HoverCardContent>
                </HoverCard>

              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
