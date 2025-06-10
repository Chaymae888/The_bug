'use client'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Tag } from '@/types/tag'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Edit, MailQuestion, ThumbsDown, ThumbsUp } from 'lucide-react'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import {followTag, getFollowedTags, getQuestionsByTagName, getTag, unfollowTag} from "@/lib/api/tags_management";
import {useAuthStore} from "@/lib/stores/useAuthStore";
import {handleRequireLogin} from "@/lib/utils/authUtils";
import {Question} from "@/types/question";
import {
  downvoteQuestion,
  followQuestion,
  getVoters,
  unfollowQuestion,
  upvoteQuestion
} from "@/lib/api/questions_management";
import {toast} from "sonner";

type SortMethod = 'popular' | 'new' | 'name';
export default function TagPage() {
  const params = useParams()
  const [tag, setTag] = useState<Tag | null>(null)
  const {isAuthenticated,  accessToken, user, setUser,followedTags,setFollowedTags,followedQuestions,setFollowedQuestions} = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tagQuestions,setTagQuestions]=useState<Question[]>([])



  const [sortMethod, setSortMethod] = useState<SortMethod>('popular');

  const sortQuestions = (questions: Question[], method: SortMethod): Question[] => {
    const sorted = [...questions];
    switch (method) {
      case 'popular':
        return sorted.sort((a, b) => b.answerCount - a.answerCount);
      case 'new':
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'name':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return sorted;
    }
  };

  const sortedQuestions = sortQuestions(tagQuestions, sortMethod);


  const router = useRouter()
  useEffect(() => {
    const fetchTagData = async () => {
      try {
        // Verify we have params and params.name
        if (!params?.name) {
          throw new Error('Tag name not specified in URL');
        }

        const tagName = Array.isArray(params.name) ? params.name[0] : params.name;
        const fetchedTag: Tag = await getTag(tagName);

        setTag(fetchedTag);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tag');
      } finally {
        setLoading(false);
      }
    };

    fetchTagData();
  }, [params?.name]);

  useEffect(() => {
    const fetchData = async () => {
      if (!tag) return;

      try {
        const fetchedQuestions = await getQuestionsByTagName(tag.name);
        setTagQuestions(fetchedQuestions);

        if (!user || !accessToken || !isAuthenticated) return;

        if (user?.userId) {
          const userFollowedTags = await getFollowedTags(accessToken);
          setFollowedTags(userFollowedTags);
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      }
    };

    fetchData();
  }, [tag, user?.userId, accessToken, isAuthenticated]);

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

      const isFollowing = followedTags?.some(
          following => following.id === tagToToggle.id
      );

      if (isFollowing) {
        await unfollowTag(tagToToggle.id, accessToken);
        setFollowedTags(followedTags?.filter(f => f.id !== tagToToggle.id) ?? null);
      } else {
        await followTag(tagToToggle.id, accessToken);
        setFollowedTags([...(followedTags || []), tagToToggle]);
      }
    } catch (err) {
      console.error('Failed to toggle follow:', err);
      toast.error('Failed to toggle follow');
    }
  }

  const togglefollowQuestion = async (questionToToggle: Question) => {
    try {
      if (!user || !accessToken) {
        handleRequireLogin('follow question', router);
        return;
      }

      const isFollowing = followedQuestions?.some(
          following => following.id === questionToToggle.id
      ) ?? false;

      if (isFollowing) {
        await unfollowQuestion(questionToToggle.id, accessToken);
      } else {
        await followQuestion(questionToToggle.id, accessToken);
      }
      const updatedFollowedQuestions = isFollowing
          ? followedQuestions?.filter(f => f.id !== questionToToggle.id) ?? null
          : [...(followedQuestions || []), questionToToggle];
      setFollowedQuestions(updatedFollowedQuestions)
    } catch (err) {
      console.error('Failed to toggle follow:', err);
      setUser(user);
    }
  }
  const handleVote = async (questionId: number, isUpvote: boolean) => {
    try{
      if (!user || !accessToken) {
        handleRequireLogin('vote', router);
        return;
      }

      const voters = await getVoters(questionId);
      const alreadyVoted = voters.some(voter => voter.userId === user.userId);
      if (alreadyVoted) {
        toast.error("You have already voted");
        return;
      }
      if (isUpvote) {
        await upvoteQuestion(questionId, accessToken);
      } else {
        await downvoteQuestion(questionId, accessToken);
      }

      const fetchedQuestions = await getQuestionsByTagName(tag!.name);
      setTagQuestions(fetchedQuestions);


    }catch (err) {
      console.error('Failed to vote:', err);
      toast.error('Failed to process your vote');
    }
  }



  if (loading) return <div className='p-4'>Loading...</div>
  if (error) return <div className='p-4 text-red-500'>Error: {error}</div>
  if (!tag) return <div className='p-4'>Tag not found</div>

  return (
    <div className='flex flex-col p-4'>
      <div className='flex justify-between items-center'>
        <h1 className='text-[50px] text-textPrimary'>[{tag.name}]</h1>
        {followedTags?.includes(tag) && (
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
        className={`cursor-pointer rounded-[10px] w-fit mt-4 transition-colors ${followedTags?.includes(tag) ? 'bg-gray-200 text-gray-800 hover:bg-gray-300 border border-gray-300'
            : 'bg-buttons text-white hover:bg-buttonsHover'
          }`}
      >
        {followedTags?.includes(tag) ? 'Watching' : 'Watch tag'}
      </Button>
      <div className='flex flex-col w-full p-5 h-screen'>
        <div className='flex justify-between '>
          <h1 className='font-bold text-textPrimary'>{tag.usageCount} questions </h1>
          <div className=' border border-textSecondary w-45 h-8 rounded-[5px] flex items-center justify-around '>
            <h1
                className={`hover:bg-buttons hover:text-white text-textSecondary text-sm p-1 rounded-[5px] cursor-pointer ${
                    sortMethod === 'popular' ? 'bg-buttons text-white' : ''
                }`}
                onClick={() => setSortMethod('popular')}
            >Popular</h1>
            <h1
                className={`hover:bg-buttons hover:text-white text-textSecondary text-sm p-1 rounded-[5px] cursor-pointer ${
                    sortMethod === 'new' ? 'bg-buttons text-white' : ''
                }`}
                onClick={() => setSortMethod('new')}
            >New</h1>
            <h1
                className={`hover:bg-buttons hover:text-white text-textSecondary text-sm p-1 rounded-[5px] cursor-pointer ${
                    sortMethod === 'name' ? 'bg-buttons text-white' : ''
                }`}
                onClick={() => setSortMethod('name')}
            >Name</h1>
          </div>
        </div>
        <div className='space-y-4 pt-4'>
          {sortedQuestions.map((question) => (
            <div key={question.id} className='bg-backgroundSecondary shadow-md rounded-lg p-4'>
              <div className='flex justify-between'>
                <div className='flex items-center space-x-2'>
                  <Avatar className="cursor-pointer">
                    <AvatarImage src={question.user.photoUrl} />
                    <AvatarFallback>JN</AvatarFallback>
                  </Avatar>

                  <div>
                    <p className='text-sm font-semibold'>{question.user.infoUser.username}</p>
                    <p className='text-xs text-gray-500'>{question.user.followingCount} followers</p>
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
                      handleVote(question.id,true)
                    } else {
                      handleRequireLogin('vote', router);
                    }
                  }} className='hover:text-buttons cursor-pointer w-4 h-4 text-icons-primary' />
                  <span className='text-sm text-textSecondary'>{question.voteScore}</span>
                  <ThumbsDown onClick={() => {
                    if (isAuthenticated) {
                      handleVote(question.id,false)
                    } else {
                      handleRequireLogin('vote', router);
                    }
                  }} className='hover:text-buttons cursor-pointer w-4 h-4 text-icons-primary' />
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
