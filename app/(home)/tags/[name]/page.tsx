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
import {followTag, unfollowTag} from "@/lib/api/tags_management";
import {useAuthStore} from "@/lib/stores/useAuthStore";
import {handleRequireLogin} from "@/lib/utils/authUtils";
import {Question} from "@/types/question";
import {downvoteQuestion, followQuestion, unfollowQuestion, upvoteQuestion} from "@/lib/api/questions_management";
import {toast} from "sonner";


export default function TagPage() {
  const params = useParams()
  const [tag, setTag] = useState<Tag | null>(null)
  const {isAuthenticated,  accessToken, user, setUser} = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()

  const togglefollowTag = async (tagToToggle: Tag) => {
    try {
      if (!user) {
        console.error('No user logged in');
        return;
      }
      if (!accessToken) {
        console.error('Your session is expired you should login again');
        return;

      }

      const isFollowing = user.tagsfollowings.some(
          following => following.id === tagToToggle.id
      );
      const updatedUser = {
        ...user,
        tagsfollowings: isFollowing
            ? user.tagsfollowings.filter(f => f.id !== tagToToggle.id)
            : [...user.tagsfollowings, tagToToggle]
      };
      setUser(updatedUser);
      if (isFollowing) {
        await unfollowTag(tagToToggle.id, accessToken);
      } else {
        await followTag(tagToToggle.id, accessToken);
      }
    } catch (err) {
      console.error('Failed to toggle follow:', err);
      setUser(user);
    }
  }
  const togglefollowQuestion = async (questionToToggle: Question) => {
    try {
      if (!user) {
        console.error('No user logged in');
        return;
      }
      if (!accessToken) {
        console.error('Your session is expired you should login again');
        return;

      }

      const isFollowing = user.questionsFollowings.some(
          following => following.id === questionToToggle.id
      );
      const updatedUser = {
        ...user,
        questionsFollowings: isFollowing
            ? user.questionsFollowings.filter(f => f.id !== questionToToggle.id)
            : [...user.questionsFollowings, questionToToggle]
      };
      setUser(updatedUser);
      if (isFollowing) {
        await unfollowQuestion(questionToToggle.id, accessToken);
      } else {
        await followQuestion(questionToToggle.id, accessToken);
      }
    } catch (err) {
      console.error('Failed to toggle follow:', err);
      setUser(user);
    }
  }
  const upvote = async (questionToToggle: Question) => {
    try{
      if (!user) {
        console.error('No user logged in');
        return;
      }
      if (!accessToken) {
        console.error('Your session is expired you should login again');
        return;

      }
      const alreadyUpVoted = questionToToggle.upvotersId.some(
          upvoterId => upvoterId === user.userId
      );
      if (alreadyUpVoted) {
        toast.error("You have already upvoted");
      }else{
        const alreadyDownVoted = questionToToggle.downvotersId.some(
            downvoterId => downvoterId === user.userId
        );
        if (alreadyDownVoted) {
          toast.error("You can't downvote and upvote a question");
        }else{
          await upvoteQuestion(questionToToggle.id, accessToken);

        }
      }


    }catch (err) {
      console.error('Failed to toggle upvote:', err);
      setUser(user);
    }
  }
  const downvote = async (questionToToggle: Question) => {
    try{
      if (!user) {
        console.error('No user logged in');
        return;
      }
      if (!accessToken) {
        console.error('Your session is expired you should login again');
        return;

      }
      const alreadyUpVoted = questionToToggle.upvotersId.some(
          upvoterId => upvoterId === user.userId
      );
      if (alreadyUpVoted) {
        toast.error("You can't downvote and upvote a question");
      }else{
        const alreadyDownVoted = questionToToggle.downvotersId.some(
            downvoterId => downvoterId === user.userId
        );
        if (alreadyDownVoted) {
          toast.error("You have already downvoted");
        }else{
          await downvoteQuestion(questionToToggle.id, accessToken);

        }
      }


    }catch (err) {
      console.error('Failed to toggle upvote:', err);
      setUser(user);
    }
  }



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
        {user?.tagsfollowings.includes(tag) && (
          <Button
            variant="outline"
            className='cursor-pointer bg-buttons text-white rounded-full hover:bg-buttonsHover'
            onClick={() => router.push('/questions/ask')}
          >
            Add a question
          </Button>
        )}
      </div>



      <Button
        onClick={() => {
          if (isAuthenticated) {
            togglefollowTag(tag)
          } else {
            handleRequireLogin('follow someone', router);
          }
        }}
        className={`cursor-pointer rounded-[10px] w-fit mt-4 transition-colors ${user?.tagsfollowings.includes(tag) ? 'bg-gray-200 text-gray-800 hover:bg-gray-300 border border-gray-300'
            : 'bg-buttons text-white hover:bg-buttonsHover'
          }`}
      >
        {user?.tagsfollowings.includes(tag) ? 'Watching' : 'Watch tag'}
      </Button>
      <div className='flex flex-col w-full p-5 h-screen'>
        <div className='flex justify-between '>
          <h1 className='font-bold text-textPrimary'>{tag.usageCount} questions </h1>
          <div className=' border border-textSecondary w-45 h-8 rounded-[5px] flex items-center justify-around '>
            <h1 className='hover:bg-buttons hover:text-white text-textSecondary text-sm p-1 rounded-[5px]'>Popular</h1>
            <h1 className='hover:bg-buttons hover:text-white text-textSecondary text-sm p-1 rounded-[5px]'>New</h1>
            <h1 className='hover:bg-buttons hover:text-white text-textSecondary text-sm p-1 rounded-[5px]'>Name</h1>
          </div>
        </div>
        <div className='space-y-4 pt-4'>
          {tag.questions.map((question) => (
            <div key={question.id} className='bg-backgroundSecondary shadow-md rounded-lg p-4'>
              <div className='flex justify-between'>
                <div className='flex items-center space-x-2'>
                  <Avatar className="cursor-pointer">
                    <AvatarImage src={question.user.photoUrl} />
                    <AvatarFallback>JN</AvatarFallback>
                  </Avatar>

                  <div>
                    <p className='text-sm font-semibold'>{question.user.infoUser.username}</p>
                    <p className='text-xs text-gray-500'>{question.user.followingCount}</p>
                  </div>
                </div>
                <Button onClick={() => {
                  if (isAuthenticated) {
                    togglefollowTag(tag)
                  } else {
                    handleRequireLogin('follow someone', router);
                  }
                }} className='cursor-pointer bg-backgroundSecondary text-buttons border border-buttons rounded-full hover:bg-buttons hover:text-white'>Suivre</Button>
              </div>

              <h2 className='pt-2 text-lg font-bold hover:text-buttons underline underline-offset-4 line-clamp-2 w-fit'>{question.title}</h2>
              <p className='text-sm pl-2 pt-1 text-gray-500 line-clamp-3'>{question.plainTextContent}</p>
              <h1 className='pt-2 font-bold text-sm  text-textSecondary hover:text-buttons'>{question.answerCount} responses</h1>

              <div className='flex items-center space-x-2 pt-2'>
                <div className='w-fit h-8 bg-backgroundPrimary border border-borderColor rounded-lg flex items-center justify-center space-x-2 px-2'>
                  <ThumbsUp onClick={() => {
                    if (isAuthenticated) {
                      upvote(question)
                    } else {
                      handleRequireLogin('vote', router);
                    }
                  }} className='hover:text-buttons cursor-pointer w-4 h-4 text-icons-primary' />
                  <span className='text-sm text-textSecondary'>{question.upvotersId.length}</span>
                  <Separator orientation='vertical' className='h-4 w-0 bg-borderColor' />
                  <ThumbsDown onClick={() => {
                    if (isAuthenticated) {
                      downvote(question)
                    } else {
                      handleRequireLogin('vote', router);
                    }
                  }} className='hover:text-buttons cursor-pointer w-4 h-4 text-icons-primary' />
                  <span className='text-sm text-textSecondary'>{question.upvotersId.length }</span>
                </div>
                <HoverCard><HoverCardTrigger>
                  <Edit onClick={() => {
                    if (isAuthenticated) {
                      document.getElementById('answer-section')?.scrollIntoView({
                        behavior: 'smooth'
                      });
                    } else {
                      handleRequireLogin('answer question', router);
                    }
                  }} className='hover:text-buttons cursor-pointer w-6 h-6 text-textSecondary' /></HoverCardTrigger>
                  <HoverCardContent className='bg-backgroundSecondary w-fit h-fit border-borderColor '> Answer the question </HoverCardContent>
                </HoverCard>
                <HoverCard>
                  <HoverCardTrigger>
                    <MailQuestion onClick={() => {
                      if (isAuthenticated) {
                        togglefollowQuestion(question)
                      } else {
                        handleRequireLogin('follow a question', router);
                      }
                    }} className='hover:text-buttons cursor-pointer w-6 h-6 text-textSecondary' />
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
