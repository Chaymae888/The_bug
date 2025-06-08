'use client'
import React, { useRef } from 'react'
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createImageNode } from '@/components/editor/nodes/ImageNode';
import { $insertNodes } from 'lexical';

export default function ImagePlugin() {
    const [url, setUrl] = React.useState('');
    const [file, setFile] = React.useState<File | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [editor] = useLexicalComposerContext();
    // In your ImagePlugin.ts
const onAddImage = () => {
    if (!url && !file) return;
  
   
    editor.update(() => {
      const imageSrc = file ? URL.createObjectURL(file) : url;
      
      const imageNode = $createImageNode(
        imageSrc,
        file?.name || 'Editor image',
        400,
        'inherit',
        'inherit'
      );
  
      $insertNodes([imageNode]);
      imageNode.selectNext();
    });
  
    if (file) URL.revokeObjectURL(URL.createObjectURL(file));
    setFile(null);
    setUrl('');
  };


    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 px-2">
                    <Image
                        src="/assets/icons/image-picture-svgrepo-com.svg"
                        alt="Add image"
                        width={16}
                        height={16}
                        className="w-4 h-4 pt-1"
                    />
                    <span className="sr-only">Add image</span>
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px] bg-backgroundSecondary border-borderColor">
                <DialogHeader>
                    <DialogTitle >Add Image</DialogTitle>
                    <DialogDescription>
                        Upload an image file or paste an image URL
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Input
                            value={url}
                            onChange={(e) => {
                                setUrl(e.target.value);
                                if (e.target.value) setFile(null);
                            }}
                            placeholder="Enter image URL"
                            className='border-borderColor focus-visible:ring-0 focus-visible:border-buttons bg-backgroundSecondary'
                        />

                        <p className="text-center text-sm text-muted-foreground">or</p>

                        <Button
                            variant="outline"
                            onClick={() => inputRef.current?.click()}
                            className="w-full border-borderColor text-buttons"
                        >
                            {file ? file.name : "Upload Image"}
                        </Button>

                        <input
                            type="file"
                            ref={inputRef}
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                const selectedFile = e.target.files?.[0];
                                if (selectedFile) {
                                    setFile(selectedFile);
                                    setUrl('');
                                }
                            }}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" className='border-borderColor text-buttons'>Cancel</Button>
                    </DialogClose>
                    <Button
                        type="submit"
                        className='border-buttons text-buttons'
                        disabled={!url && !file}
                        onClick={onAddImage}
                    >
                        Add Image
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}