// components/editor/Editor.tsx
'use client';
import { useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { $generateHtmlFromNodes } from '@lexical/html';

export function HtmlExportPlugin({ onHtmlChange }: { onHtmlChange: (html: string) => void }) {
  const [editor] = useLexicalComposerContext();
  const [isMounted, setIsMounted] = useState(false);

  return (
    <OnChangePlugin
      onChange={(editorState) => {
        if (!isMounted) {
          setIsMounted(true);
          return;
        }
        
        editorState.read(() => {
          const html = $generateHtmlFromNodes(editor, null);
          onHtmlChange(html);
        });
      }}
    />
  );
}