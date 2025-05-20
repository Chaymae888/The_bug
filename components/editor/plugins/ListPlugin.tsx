import {
    INSERT_ORDERED_LIST_COMMAND,
    INSERT_UNORDERED_LIST_COMMAND,
    REMOVE_LIST_COMMAND,
    $isListNode
} from '@lexical/list';
import { $getSelection, $isRangeSelection } from 'lexical';
import {useCallback, useState} from "react";

export function useListFormatting(editor: any) {
    const [isNumberedList, setIsNumberedList] = useState(false);
    const [isBulletedList, setIsBulletedList] = useState(false);

    const updateListFormatting = useCallback(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            const anchorNode = selection.anchor.getNode();
            const element = anchorNode.getTopLevelElement();

            if ($isListNode(element)) {
                setIsNumberedList(element.getListType() === 'number');
                setIsBulletedList(element.getListType() === 'bullet');
            } else {
                setIsNumberedList(false);
                setIsBulletedList(false);
            }
        }
    }, []);

    const toggleList = useCallback((listType: 'number' | 'bullet') => {
        editor.update(() => {
            const selection = $getSelection();

            if ($isRangeSelection(selection)) {
                const anchorNode = selection.anchor.getNode();
                const element = anchorNode.getTopLevelElement();

                if ($isListNode(element)) {
                    if (element.getListType() === listType) {
                        editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
                    } else {
                        element.setListType(listType);
                    }
                } else {
                    editor.dispatchCommand(
                        listType === 'number'
                            ? INSERT_ORDERED_LIST_COMMAND
                            : INSERT_UNORDERED_LIST_COMMAND,
                        undefined
                    );
                }
            }
        });
    }, [editor]);

    return {
        isNumberedList,
        isBulletedList,
        toggleList,
        updateListFormatting
    };
}