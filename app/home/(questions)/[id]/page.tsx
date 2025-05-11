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

interface QuestionData {
    id: string
    title: string
    tags: string[]
    content: string
}

// Register all node types you've used in the editor
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
        ImageNode // Make sure to include ImageNode
    ],
    onError: (error: Error) => console.error(error),
    theme: Theme // Use the same theme as your editor
}

export default function QuestionPage() {
    const params = useParams()
    const [question, setQuestion] = useState<QuestionData | null>(null)

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
            <div className='flex gap-40 mb-4 px-6'>
                <h3>Asked</h3>
                <h3>Viewed</h3>
            </div>
            <div className='flex h-full min-h-[400px] bg-backgroundSecondary border border-borderColor rounded-[5px]'>
                <div className='flex flex-col p-4 w-20 items-center'>
                    <div className='relative group'>
                        <Avatar className='rounded-[4px] z-10 w-15 h-15 left-5 top-2 transition-all duration-300 group-hover:w-14 group-hover:h-14 group-hover:-translate-y-1'>
                            <AvatarImage  src='https://github.com/shadCN.png' />
                            <AvatarFallback className='text-xs'>JN</AvatarFallback>
                        </Avatar>
                        <div className='bg-backgroundSecondary flex flex-col text-sm opacity-0 
                            group-hover:opacity-100 transition-opacity duration-300
                            absolute left-21 top-0 bg-background p-3 
                            rounded-md shadow-lg z-50 w-[200px] border border-borderColor'>
                            <h1 className='font-medium'>John Doe</h1>
                            <h1 className="text-muted-foreground">Morroco</h1>
                            <h1 className="text-muted-foreground">5000 followers</h1>
                        </div>
                    </div>
                </div>
                <Separator 
                    className='bg-buttons h-auto my-4 mx-1' 
                    orientation='vertical' 
                />
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
        </div>
    )
}