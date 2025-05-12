'use client'
import { useEffect, useState } from 'react'
import { notFound, useParams } from 'next/navigation'
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
import { ImageNode } from '@/nodes/ImageNode'
import Theme from '@/components/editor/plugins/Theme'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Edit, MailQuestion, ThumbsDown, ThumbsUp } from 'lucide-react'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Editor } from '@/components/editor/Editor'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { nanoid } from 'nanoid'

interface QuestionData {
    id: string
    title: string
    tags: string[]
    content: string
}
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
    const params = useParams()
    const [question, setQuestion] = useState<QuestionData | null>(null)
    const [editorContent, setEditorContent] = useState('')

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

    if (!question) return <div>Loading...</div>

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-6">{question.title}</h1>
            <div className='flex text-sm gap-40 mb-1 px-6'>
                <div className='flex gap-1'>
                    <h3>Asked </h3>
                    <h3 className='text-sidebar-text-default'>1 min ago</h3>
                </div>
                <div className='flex gap-1'>
                    <h3>Viewed </h3>
                    <h3 className='text-sidebar-text-default'>0</h3>
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
                                <h1 className='text-buttons font-medium'>John Doe</h1>
                                <h1 className="text-textSecondary">Morroco</h1>
                                <h1 className="text-textSecondary">5000 followers</h1>
                            </div>
                        </div>
                        <div className='flex flex-col gap-8 items-center'>
                            <div className='flex flex-col gap-2'>
                                <ThumbsUp onClick={() => { }} className='hover:text-buttons text-3xl cursor-pointer text-icons-primary w-8 h-8 relative left-5' />
                            <h1 className='text-textSecondary text-xl relative left-7'>0</h1>
                            <ThumbsDown onClick={() => { }} className='hover:text-buttons text-3xl cursor-pointer text-icons-primary w-8 h-8 relative left-5' />
                            
                            </div>
                            <div className='flex flex-col gap-2'>
                                <HoverCard><HoverCardTrigger>
                                <Edit onClick={() => { }} className='hover:text-buttons cursor-pointer w-6 h-6 text-textSecondary relative left-5' /></HoverCardTrigger>
                                <HoverCardContent className='bg-backgroundSecondary w-fit h-fit border-borderColor '> Answer the question </HoverCardContent>
                            </HoverCard>
                            <HoverCard>
                                <HoverCardTrigger>
                                    <MailQuestion onClick={() => {}} className='hover:text-buttons cursor-pointer w-6 h-6 text-textSecondary relative left-5' />
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
                        <Link key={tag} href={`/tags/${nanoid()}?name=${encodeURIComponent(tag)}`}>
                      <Badge className='text-textSecondary bg-backgroundPrimary text-md hover:text-backgroundSecondary hover:bg-buttons' >
                        {tag}
                      </Badge>
                    </Link>
                    ))}
                </div>
            </div>
            <div className='flex py-2 h-fit mt-10 flex-col bg-backgroundSecondary border border-borderColor rounded-[5px]'>
                <div className='flex px-6 gap-2 text-textSecondary'>
                    <h1 >0</h1>
                    <h1>answers</h1>
                </div>

            </div>
            <div className='flex h-fit mt-10 flex-col h-full min-h-[400px] bg-transparent'> 
                <h1 className='px-6 text-textPrimary text-xl pb-10'>Your answer</h1>
                <Editor onSave={setEditorContent}/>
                <Button onClick={()=>{}} className='cursor-pointer bg-buttons text-white rounded-[10px] hover:bg-buttonsHover w-fit mt-4'>Post your answer</Button>
        
            </div>
        </div>
    )
}