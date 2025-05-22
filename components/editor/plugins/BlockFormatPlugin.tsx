import {$createParagraphNode, $getSelection, LexicalEditor} from 'lexical';
import { $setBlocksType } from '@lexical/selection';
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import { $createCodeNode } from '@lexical/code';
import {useCallback} from "react";

export function useBlockFormatting(editor:  LexicalEditor, activeBlock: string | null) {
    const toggleBlock = useCallback((type: 'h1' | 'h2' | 'h3' | 'quote' | 'code') => {
        const selection = $getSelection();

        if (activeBlock === type) {
            return $setBlocksType(selection, () => $createParagraphNode());
        }

        if (type === 'h1') {
            return $setBlocksType(selection, () => $createHeadingNode('h1'));
        }

        if (type === 'h2') {
            return $setBlocksType(selection, () => $createHeadingNode('h2'));
        }

        if (type === 'h3') {
            return $setBlocksType(selection, () => $createHeadingNode('h3'));
        }

        if (type === 'quote') {
            return $setBlocksType(selection, () => $createQuoteNode());
        }
        if (type === 'code') {
            return $setBlocksType(selection, () => $createCodeNode());
        }
    }, [activeBlock]);

    return { toggleBlock };
}