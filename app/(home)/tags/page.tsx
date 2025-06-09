'use client'
import React, {useEffect, useState} from 'react'
import SearchInput from '@/components/search-input'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'
import {Tag} from '@/types/tag'
import {getTags} from "@/lib/api/tags_management";



const TagList = () => {
    const router = useRouter();
    const [tags, setTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        const fetchTags = async () => {
            try {
                setLoading(true);
                const fetchedTags = await getTags();
                setTags(fetchedTags);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch tags:', err);
                setError(err instanceof Error ? err.message : 'Failed to load tags');
            } finally {
                setLoading(false);
            }
        };

        fetchTags();
    }, []);

    if (loading) {
        return <div>Loading tags...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }


  const handleClick = (tag : Tag) => {
    sessionStorage.setItem('current-tag', JSON.stringify(tag));
  // Create URL-safe version of the name
  const urlSafeName = tag.name.toLowerCase()
    .replace(/\s+/g, '-')       
    .replace(/[^a-z0-9-]/g, '');
  router.push(`/tags/${urlSafeName}`);
  };
  return (
    <div className='p-4 flex flex-col'>
      <h1 className='text-[50px] text-textPrimary'>Tags</h1>
      <h1 className='py-6 w-2/3 text-textPrimary'>A tag is a keyword or label that categorizes your question with other, similar questions. Using the right tags makes it easier for others to find and answer your question.</h1>
      <div className='flex justify-between items-center'>
        <SearchInput placeholder='Filter by tag name' className='w-50 border border-textSecondary rounded-full' />
        <div className=' border border-textSecondary w-45 h-8 rounded-[5px] flex items-center justify-around '>
          <h1 className='hover:bg-buttons hover:text-white text-textSecondary text-sm p-1 rounded-[5px]'>Popular</h1>
          <h1 className='hover:bg-buttons hover:text-white text-textSecondary text-sm p-1 rounded-[5px]'>New</h1>
          <h1 className='hover:bg-buttons hover:text-white text-textSecondary text-sm p-1 rounded-[5px]'>Name</h1>
        </div>
      </div>
      <div className='flex flex-wrap gap-2 py-4'>
        {tags.map((tag, index) => (

          <div
            onClick={() => handleClick(tag)}
            key={index}
            className='bg-backgroundSecondary border border-borderColor rounded p-2 hover:shadow-md transition-shadow flex-grow w-[calc(50%-8px)] md:max-w-[calc(25%-8px)] md:min-w-[200px] relative'
          >

            <div className='relative z-0'> {/* Content stays above link */}
              <Badge className='text-textSecondary bg-backgroundPrimary'>
                {tag.name}
              </Badge>
              <div className='text-textSecondary text-xs'>
                {tag.usageCount.toLocaleString()} questions
              </div>
            </div>
          </div>
        ))}


      </div></div>
  )
}


export default TagList
