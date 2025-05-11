'use client';
import { ListNode, ListItemNode } from '@lexical/list';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import React, { useEffect } from 'react';
import Theme from './plugins/Theme';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { LinkNode, AutoLinkNode } from '@lexical/link';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { ImageNode, registerImageNode } from '@/nodes/ImageNode';

function Placeholder() {
  return <div className="editor-placeholder">Enter some rich text...</div>;
}

function EditorContent({ onSave }: { onSave: (content: string) => void }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const json = editorState.toJSON();
        onSave(JSON.stringify(json));
      });
    });
  }, [editor, onSave]);

  return (
    <>
      <ToolbarPlugin />
      <div className="editor-inner h-fit min-h-[50vh]">
        <RichTextPlugin
          contentEditable={<ContentEditable className="editor-input h-full" />}
          placeholder={<Placeholder />}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <ListPlugin /> 
          <LinkPlugin />
        <HistoryPlugin />
        <AutoFocusPlugin />
      </div>
    </>
  );
}

export function Editor({ onSave }: { onSave: (content: string) => void }) {
  const initialConfig = registerImageNode({
    namespace: 'Editor',
    onError: (error: Error) => {
      console.error(error);
      throw error;
    },
    theme: Theme,
    nodes: [
      HeadingNode,
      QuoteNode,
      ListNode,
      ListItemNode,
      LinkNode,
      CodeNode,
      CodeHighlightNode,
      ImageNode
    ],
  });

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="editor-container size-full">
        <EditorContent onSave={onSave} />
      </div>
    </LexicalComposer>
  );
}