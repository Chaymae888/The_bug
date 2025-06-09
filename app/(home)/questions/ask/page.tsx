'use client'
import  {Editor}  from '@/components/editor/Editor'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import {SelectTags} from '@/components/SelectTags'
import { useRouter } from 'next/navigation'
import {useAuthStore} from "@/lib/stores/useAuthStore";
import {addQuestion} from "@/lib/api/questions_management";


export default function Ask() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [editorContent, setEditorContent] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const {accessToken} = useAuthStore()

    const handleSubmit = async () => {
        const formData = {
            title,
            content: editorContent,
            tagNames: selectedTags,
        };

        try {
            if (!accessToken) {
                console.log("Access Token not set");
                return;
            }


            if (!formData.title?.trim() || !formData.content?.trim()) {
                console.error("Title and content are required");
                return;
            }
            console.log(`this is the access token:${accessToken}`);
            console.log("Submitting question:", formData); // Debug log

            const question = await addQuestion(formData, accessToken);
            sessionStorage.setItem(`question-${question.id}`, JSON.stringify(question));
            router.push(`/questions/${question.id}`);
        } catch (error) {
            console.error('Failed to submit question:', error);
            // Show user-friendly error message
        }
    }
  return (
    <div className='p-4 flex flex-col'>
        <h1 className='text-[50px] text-textPrimary'>Ask a public question</h1>
        <div className='bg-blue-200 border border-blue-500 rounded-[10px] p-6 w-fit'>
            <h1 className='text-[20px] pb-3'>Writing a good question</h1>
            <h1 className='pb-2'>You’re ready to ask a programming-related question and this form will help guide you through the process.</h1>
            <h1 className='font-bold'>Steps</h1>
            <ul className='list-disc pl-8'>
                <li className='text-[13px]'>Summarize your problem in a one-line title.</li>
                <li className='text-[13px]'>Describe your problem in more detail.</li>
                <li className='text-[13px]'>Describe what you tried and what you expected to happen.</li>
                <li className='text-[13px]'>Add “tags” which help surface your question to members of the community.</li>
                <li className='text-[13px]'>Review your question and post it to the site.</li>
            </ul>
        </div>
        <div>
        <h1 className='font-bold pt-8'>Title</h1>
        <h3 className='pt-4 pb-1' >Be specific and imagine you’re asking a question to another person.</h3>
        <Input type='text' value={title} onChange={(e)=>setTitle(e.target.value)} placeholder='e.g. Is there an R function for finding the index of an element in a vector?' className='border border-borderColor  bg-backgroundSecondary rounded-[10px] w-1/2 ' />
        </div>
        <div>
        <h1 className='font-bold pt-8'>What are the details of your problem?</h1>
        <h3 className='pt-4 pb-1' >Include all the information someone would need to answer your question</h3>
        <Editor onSave={setEditorContent}/>
        </div>
        <div className='py-8'>
        <h1 className='font-bold '>Tags</h1>
        <h3 className='pt-4 pb-1' >Add up to 5 tags to describe what your question is about</h3>
        <SelectTags onSelectedItemsChange={setSelectedTags}/>
        </div>

        <Button onClick={handleSubmit} className='cursor-pointer bg-buttons text-white rounded-[10px] hover:bg-buttonsHover w-fit mt-4'>Post your question</Button>
        </div>
  )
}