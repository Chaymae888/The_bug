import { $createLinkNode} from '@lexical/link';
import { $createTextNode, $getSelection, $isRangeSelection } from 'lexical';
import {useCallback} from 'react';

export function useLinkHandling(editor: any) {
    const insertLink = useCallback(() => {
        editor.update(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection)) return;

            const text = selection.getTextContent() || 'Link';
            let url = prompt('Enter URL:', 'https://');

            if (!url) return;
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                url = 'https://' + url;
            }

            const linkNode = $createLinkNode(url, {
                rel: 'noopener noreferrer',
                target: '_blank',
                title: url,
            });

            if (selection.isCollapsed()) {
                linkNode.append($createTextNode(text));
                selection.insertNodes([linkNode]);
            } else {
                selection.insertNodes([linkNode]);
            }
        });
    }, [editor]);

    return { insertLink };
}