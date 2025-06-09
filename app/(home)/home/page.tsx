'use client';
import React, {useEffect, useState} from 'react'
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
import {Question} from "@/types/question";
import {
  downvoteQuestion,
  followQuestion,
  getQuestions,
  unfollowQuestion,
  upvoteQuestion
} from "@/lib/api/questions_management";
import {User} from "@/types/user";
import {followUser, unfollowUser} from "@/lib/api/users_management";
import {toast} from "sonner";



const Home = () => {
  const router = useRouter();
  const {isAuthenticated, hydrated, accessToken, user, setUser} = useAuthStore()
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const fetchedQuestions = await getQuestions();
        setQuestions(fetchedQuestions);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch questions:', err);
        setError(err instanceof Error ? err.message : 'Failed to load questions');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);
  if (!hydrated) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }


  if (loading) {
    return <div>Loading questions...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  const handleClick = (username: string) => {
    const urlSafeName = username.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
    router.push(`/users/${urlSafeName}`);
  };

  const seeQuestionDetails = (question: Question) => {
    sessionStorage.setItem(`question-${question.id}`, JSON.stringify(question));
    router.push(`/questions/${question.id}`);
  }

  const togglefollowUser = async (userToToggle: User) => {
    try {
      if (!user) {
        console.error('No user logged in');
        return;
      }
      if (!accessToken) {
        console.error('Your session is expired you should login again');
        return;

      }

      const isFollowing = user.userFollowings.some(
          following => following.userId === userToToggle.userId
      );
      const updatedUser = {
        ...user,
        userFollowings: isFollowing
            ? user.userFollowings.filter(f => f.userId !== userToToggle.userId)
            : [...user.userFollowings, userToToggle]
      };
      setUser(updatedUser);
      if (isFollowing) {
        await unfollowUser(userToToggle.userId, accessToken);
      } else {
        await followUser(userToToggle.userId, accessToken);
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


  return (
        <div className='flex flex-col md:flex-row'>

          <div className='flex flex-col md:w-2/3 p-5 h-screen'>
            <div className='flex justify-between'>
              <h1 className='font-bold text-textPrimary'>Newest questions </h1>
              <Button variant="outline" className='cursor-pointer bg-buttons text-backgroundPrimary rounded-full '
                      onClick={isAuthenticated ? () => {
                        router.push('/questions/ask')
                      } : () => {
                        handleRequireLogin("ask a question", router)
                      }}>Add a question</Button>
            </div>
            <div className='space-y-4 pt-4'>
              {questions.map((question) => (
                  <div key={question.id} className='bg-backgroundSecondary shadow-md rounded-lg p-4'>
                    <div className='flex justify-between'>
                      <div className='flex items-center space-x-2'>
                        <Avatar onClick={() => handleClick(question.user.infoUser.username)}
                                className="cursor-pointer">
                          <AvatarImage src='https://github.com/shadCN.png'/>
                          <AvatarFallback>JN</AvatarFallback>
                        </Avatar>

                        <div>
                          <p className='text-sm font-semibold '>{question.user.infoUser.username}</p>
                          <p className='text-xs text-gray-500'>{question.user.followersCount}</p>
                        </div>
                      </div>
                      <Button onClick={() => {
                        if (isAuthenticated) {
                          togglefollowUser(question.user)
                        } else {
                          handleRequireLogin('follow someone', router);
                        }
                      }}
                              className='cursor-pointer bg-backgroundSecondary text-buttons border border-buttons rounded-full hover:bg-buttons hover:text-backgroundPrimary'>{user?.userFollowings.includes(question.user) ? 'Suivi(e)' : 'Suivre'}</Button>
                    </div>

                    <h2 onClick={() => seeQuestionDetails(question)}
                        className='cursor-pointer pt-2 text-lg font-bold hover:text-buttons underline underline-offset-4 line-clamp-2 w-fit'>{question.title}</h2>
                    <p className='text-sm pl-2 pt-1 text-gray-500 line-clamp-3'>{question.plainTextContent}</p>
                    <div className='flex  justify-between pt-2'>
                      <h1 onClick={() => seeQuestionDetails(question)}
                          className='cursor-pointer font-bold text-sm  text-textSecondary hover:text-buttons'>3k
                        responses</h1>
                      <div className='flex space-x-2'>
                        {question.tags.map((tag) => (
                            <Link key={tag.name} href={`/tags/${encodeURIComponent(tag.name)}`}>
                              <Badge
                                  className='text-textSecondary bg-backgroundPrimary hover:bg-backgroundSecondary hover:text-backgroundSecondary hover:bg-buttons'>
                                {tag.name}
                              </Badge>
                            </Link>

                        ))}
                      </div>
                    </div>
                    <div className='flex items-center space-x-2 pt-2'>
                      <div
                          className='w-fit h-8 bg-backgroundPrimary border border-borderColor rounded-lg flex items-center justify-center space-x-2 px-2'>
                        <ThumbsUp onClick={() => {
                          if (isAuthenticated) {
                            upvote(question)
                          } else {
                            handleRequireLogin('vote', router);
                          }
                        }} className='hover:text-buttons cursor-pointer w-4 h-4 text-icons-primary'/>
                        <span className='text-sm text-textSecondary'>400</span>
                        <Separator orientation='vertical' className='h-4 w-0 bg-borderColor'/>
                        <ThumbsDown onClick={() => {
                          if (isAuthenticated) {
                            downvote(question)
                          } else {
                            handleRequireLogin('vote', router);
                          }
                        }} className='hover:text-buttons cursor-pointer w-4 h-4 text-icons-primary'/>
                        <span className='text-sm text-textSecondary'>34</span>
                      </div>
                      {(!user || user?.infoUser.username !== question.user.infoUser.username) &&(<HoverCard><HoverCardTrigger>
                        <Edit onClick={() => {
                          if (isAuthenticated) {
                            document.getElementById('answer-section')?.scrollIntoView({
                              behavior: 'smooth'
                            });
                          } else {
                            handleRequireLogin('answer', router);
                          }
                        }} className='hover:text-buttons cursor-pointer w-6 h-6 text-textSecondary'/></HoverCardTrigger>
                        <HoverCardContent className='bg-backgroundSecondary w-fit h-fit border-borderColor '> Answer the
                          question </HoverCardContent>
                      </HoverCard>)}
                      <HoverCard>
                        <HoverCardTrigger>
                          <MailQuestion onClick={() => {
                            if (isAuthenticated) {
                              togglefollowQuestion(question)
                            } else {
                              handleRequireLogin('follow question', router);
                            }
                          }} className='hover:text-buttons cursor-pointer w-6 h-6 text-textSecondary'/>
                        </HoverCardTrigger>
                        <HoverCardContent className='bg-backgroundSecondary w-fit h-fit border-borderColor'> follow the
                          question </HoverCardContent>
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
                    {index > 0 && <Separator className="bg-blue-50"/>}
                    <div className='flex justify-between'>
                      <div className='flex items-center space-x-2'>
                        <Avatar onClick={() => handleClick(question.user.infoUser.username)} className="cursor-pointer">
                          <AvatarImage src='https://github.com/shadCN.png'/>
                          <AvatarFallback>JN</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className='text-sm font-semibold'>{question.user.infoUser.username}</p>
                          <p className='text-xs text-gray-500'>{question.user.followersCount}</p>
                        </div>
                      </div>
                      <h1 className='font-medium text-sm  text-textSecondary '>{question.user.answerCount} responses</h1>
                    </div>

                  </React.Fragment>
              ))}
            </div>
            <h1 className='font-bold pt-6 pb-2 text-textPrimary'>Top Questions</h1>
            <div className='flex flex-col space-y-4 py-4 px-3 bg-backgroundSecondary rounded-lg'>
              {questions.map((question, index) => (
                  <React.Fragment key={question.id}>
                    {index > 0 && <Separator className="bg-blue-50"/>}
                    <div className='flex items-center space-x-2'>
                      <Avatar onClick={() => handleClick(question.user.infoUser.username)} className="cursor-pointer">
                        <AvatarImage src='https://github.com/shadCN.png'/>
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