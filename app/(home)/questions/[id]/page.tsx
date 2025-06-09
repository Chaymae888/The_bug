'use client'
import React, {useEffect, useState} from 'react'
import {notFound, useParams, useRouter} from 'next/navigation'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { ListNode, ListItemNode } from '@lexical/list'
import { LinkNode, AutoLinkNode } from '@lexical/link'
import { CodeHighlightNode, CodeNode } from '@lexical/code'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin'
import { ImageNode } from '@/components/editor/nodes/ImageNode'
import Theme from '@/components/editor/Theme'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Edit, MailQuestion, ThumbsDown, ThumbsUp } from 'lucide-react'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Editor } from '@/components/editor/Editor'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {checkToxicity} from "@/lib/api/check_comments";
import {Question} from "@/types/question";
import {useAuthStore} from "@/lib/stores/useAuthStore";
import {Separator} from "@/components/ui/separator";
import {timeAgo} from "@/lib/utils/timeAgo";
import {addAnswer} from "@/lib/api/answers_management";
import {downvoteQuestion, followQuestion, unfollowQuestion, upvoteQuestion} from "@/lib/api/questions_management";
import {toast} from "sonner";
import {handleRequireLogin} from "@/lib/utils/authUtils";






const initialConfig = {
    namespace: 'QuestionViewer',
    editable: false,
    nodes: [
        HeadingNode,
        QuoteNode,
        ListNode,
        ListItemNode,
        LinkNode,
        AutoLinkNode,
        CodeNode,
        CodeHighlightNode,
        ImageNode
    ],
    onError: (error: Error) => console.error(error),
    theme: Theme
}

export default function QuestionPage() {
    const router = useRouter();
    const [editorPlainText, setEditorPlainText] = useState('')
    const params = useParams()
    const [question, setQuestion] = useState<Question | null>(null)
    const [editorContent, setEditorContent] = useState('')

    const [isToxic, setIsToxic] = useState(false);

    const {user , accessToken, setUser, isAuthenticated} = useAuthStore();
    useEffect(() => {
        const data = sessionStorage.getItem(`question-${params.id}`)
        if (data) {
            try {
                const parsedData = JSON.parse(data)
                if (parsedData.content) {
                    setQuestion({
                        ...parsedData,
                        content: parsedData.content
                    })
                } else {
                    throw new Error('Invalid content')
                }
            } catch (e) {
                console.error('Failed to parse question data:', e)
                notFound()
            }
        } else {
            notFound()
        }
    }, [params.id])

    const checkContentToxicity = async () => {
        if (!editorPlainText.trim()) return;
        try {
            const result = await checkToxicity(editorPlainText);
            setIsToxic(
                result.toxic ||
                result.severe_toxic ||
                result.obscene ||
                result.threat ||
                result.insult ||
                result.identity_hate
            );
        } catch (error) {
            console.error('Toxicity check failed:', error);
        }
    };
    const answer = async () => {
        try{
            if (!accessToken) {
                console.error('Your session is expired you should login again');
                return;

            }
            if (!question) {
                console.error('the question is missing');
                return;

            }
            await checkContentToxicity;
            if(isToxic) return;
            else await addAnswer(question.id,editorContent,accessToken) ;
        }catch(err){
            console.error('Failed to add question:', err);
        }
    };
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

    if (!question) return <div>Loading...</div>

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-6">{question.title}</h1>
            <div className='flex text-sm gap-40 mb-1 px-6'>
                <div className='flex gap-1'>
                    <h3>Asked </h3>
                    <h3 className='text-sidebar-text-default'>{timeAgo(question.createdAt)}</h3>
                </div>
                <div className='flex gap-1'>
                    <h3>Viewed </h3>
                    <h3 className='text-sidebar-text-default'>{question.viewCount}</h3>
                </div>

            </div>
            <div className='flex  flex-col h-fit bg-backgroundSecondary border border-borderColor rounded-[5px]'>
                <div className='flex'>
                    <div className='flex flex-col p-4 w-20 items-center gap-25 '>
                        <div className='relative group'>
                            <Avatar className='rounded-[4px] z-10 w-15 h-15 left-5 top-2 transition-all duration-300 group-hover:w-14 group-hover:h-14 group-hover:-translate-y-1'>
                                <AvatarImage src='https://github.com/shadCN.png' />
                                <AvatarFallback className='text-xs'>JN</AvatarFallback>
                            </Avatar>
                            <div className='bg-backgroundSecondary flex flex-col text-sm opacity-0 
                            group-hover:opacity-100 transition-opacity duration-300
                            absolute left-21 top-0 bg-background p-3 
                            rounded-md shadow-lg z-50 w-[200px] border border-borderColor'>
                                <h1 className='text-buttons font-medium'>{question.user.infoUser.username}</h1>
                                <h1 className="text-textSecondary">{question.user.infoUser.email}</h1>
                                <h1 className="text-textSecondary">{question.user.followingCount} followings</h1>
                            </div>
                        </div>
                        <div className='flex flex-col md:flex-row'> {/* Changement ici */}
                            <div className='flex flex-col p-4 w-20 items-center gap-6'>
                            <ThumbsUp onClick={() => {
                                if (isAuthenticated) {
                                    upvote(question)
                                } else {
                                    handleRequireLogin('vote', router);
                                }
                            }} className='hover:text-buttons text-3xl cursor-pointer text-icons-primary w-8 h-8 relative left-5' />
                            <h1 className='text-textSecondary text-xl relative left-7'>0</h1>
                            <ThumbsDown onClick={() => {
                                if (isAuthenticated) {
                                    downvote(question)
                                } else {
                                    handleRequireLogin('vote', router);
                                }
                            }} className='hover:text-buttons text-3xl cursor-pointer text-icons-primary w-8 h-8 relative left-5' />
                            
                            </div>
                            <div className='flex flex-col gap-2'>
                                {(!user || user?.infoUser.username !== question.user.infoUser.username) &&(<HoverCard><HoverCardTrigger>
                                    <Edit onClick={() => {
                                        if (isAuthenticated) {
                                            document.getElementById('answer-section')?.scrollIntoView({
                                                behavior: 'smooth'
                                            });
                                        } else {
                                            handleRequireLogin('answer', router);
                                        }
                                    }}
                                          className='hover:text-buttons cursor-pointer w-6 h-6 text-textSecondary relative left-5'/></HoverCardTrigger>
                                    <HoverCardContent
                                        className='bg-backgroundSecondary w-fit h-fit border-borderColor '> Answer the
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
                                    }}
                                                      className='hover:text-buttons cursor-pointer w-6 h-6 text-textSecondary relative left-5' />
                                </HoverCardTrigger>
                                <HoverCardContent className='bg-backgroundSecondary w-fit h-fit border-borderColor'> follow the question </HoverCardContent>
                            </HoverCard>
                            </div>
                            
                        </div>


                    </div>
                    <div className="flex-1 overflow-auto">
                        <LexicalComposer initialConfig={{
                            ...initialConfig,
                            editorState: question.content
                        }}>
                            <div className="editor-container">
                                <RichTextPlugin
                                    contentEditable={
                                        <ContentEditable className="editor-input p-0 m-0 min-h-[300px]" />
                                    }
                                    placeholder={null}
                                    ErrorBoundary={LexicalErrorBoundary}
                                />
                                <HistoryPlugin />
                                <ListPlugin />
                                <LinkPlugin />
                            </div>
                        </LexicalComposer>
                    </div>
                </div>
                <div className='flex p-4 gap-4 right-1 '>
                    {question.tags.map((tag) => (
                        <Link key={tag.name} href={`/tags/${tag.name}`}>
                            <Badge className='text-textSecondary bg-backgroundPrimary text-md hover:text-backgroundSecondary hover:bg-buttons' >
                        {tag.name}
                      </Badge>
                    </Link>
                    ))}
                </div>
            </div>
            <div className='flex py-2 h-fit mt-10 flex-col bg-backgroundSecondary border border-borderColor rounded-[5px]'>
                <div className='flex px-6 mb-5 gap-2 text-textSecondary'>
                    <h1 >0</h1>
                    <h1>answers</h1>
                </div>

                {question.answers.map((answer, index) => (
                    <React.Fragment key={answer.id}>
                        {index > 0 && <Separator className="bg-blue-50" />}
                        <div className='flex'>
                            <div className='flex flex-col p-4 w-20 items-center gap-25 '>
                                <div className='relative group'>
                                    <Avatar className='rounded-[4px] z-10 w-15 h-15 left-5 top-2 transition-all duration-300 group-hover:w-14 group-hover:h-14 group-hover:-translate-y-1'>
                                        <AvatarImage src='https://github.com/shadCN.png' />
                                        <AvatarFallback className='text-xs'>JN</AvatarFallback>
                                    </Avatar>
                                    <div className='bg-backgroundSecondary flex flex-col text-sm opacity-0
                            group-hover:opacity-100 transition-opacity duration-300
                            absolute left-21 top-0 bg-background p-3
                            rounded-md shadow-lg z-50 w-[200px] border border-borderColor'>
                                        <h1 className='text-buttons font-medium'>answer.authorUsername</h1>
                                        <h1 className="text-textSecondary">answer.authorEmail</h1>
                                        <h1 className="text-textSecondary">5000 followers</h1>
                                    </div>
                                </div>
                                <div className='flex flex-col gap-8 items-center'>
                                    <div className='flex flex-col gap-2'>
                                        <ThumbsUp onClick={() => { }} className='hover:text-buttons text-3xl cursor-pointer text-icons-primary w-8 h-8 relative left-5' />
                                        <h1 className='text-textSecondary text-xl relative left-7'>0</h1>
                                        <ThumbsDown onClick={() => { }} className='hover:text-buttons text-3xl cursor-pointer text-icons-primary w-8 h-8 relative left-5' />

                                    </div>

                                </div>


                            </div>
                            <div className="flex-1 overflow-auto">
                                <LexicalComposer initialConfig={{
                                    ...initialConfig,
                                    editorState: answer.content
                                }}>
                                    <div className="editor-container">
                                        <RichTextPlugin
                                            contentEditable={
                                                <ContentEditable className="editor-input p-0 m-0 min-h-[300px]" />
                                            }
                                            placeholder={null}
                                            ErrorBoundary={LexicalErrorBoundary}
                                        />
                                        <HistoryPlugin />
                                        <ListPlugin />
                                        <LinkPlugin />
                                    </div>
                                </LexicalComposer>
                            </div>
                        </div>

                    </React.Fragment>
                ))}

            </div>
            {(!user || user?.infoUser.username !== question.user.infoUser.username) &&(< ><div  id="answer-section" className='flex h-fit mt-10 flex-col h-full min-h-[400px] bg-transparent'>
                <h1 className='px-6 text-textPrimary text-xl pb-10'>Your answer</h1>
                <Editor onSave={(content) => {
                    // Maintain existing functionality
                    setEditorContent(content);
                }}
                        onTextExtract={(plainText) => {
                            setEditorPlainText(plainText);
                        }}/>
                <Button onClick={async () => {
                    console.log(`Current text: ${editorPlainText}`);
                    await answer();
                    if (isToxic) {
                        alert('Your content contains toxic language. Please revise before posting.');
                        return;
                    }
                    // Proceed with submission
                }} className='cursor-pointer bg-buttons text-white rounded-[10px] hover:bg-buttonsHover w-fit mt-4'>Post
                    your answer</Button>

            </div>
            {isToxic && (
                <div className="mt-4 p-4 bg-red-100 border border-red-300 text-red-700 rounded">
                Warning: Your content contains potentially toxic language. Please review before posting.
                </div>
                )}</>)}
        </div>
    )
}