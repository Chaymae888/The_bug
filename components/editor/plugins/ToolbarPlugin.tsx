import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import { useDebouncedCallback } from 'use-debounce';
import {
    CAN_REDO_COMMAND,
    CAN_UNDO_COMMAND,
    FORMAT_ELEMENT_COMMAND,
    FORMAT_TEXT_COMMAND,
    REDO_COMMAND,
    SELECTION_CHANGE_COMMAND,
    UNDO_COMMAND,
} from 'lexical';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import useActiveBlock from '../../../hooks/use-activeblock';
import { useBlockFormatting } from './BlockFormatPlugin';
import { useTextFormatting } from './TextFormatPlugin';
import { useListFormatting } from './ListPlugin';
import { useLinkHandling } from './LinkPlugin';
import ImagePlugin from '@/components/editor/plugins/ImagePlugin';

const LowPriority = 1;

function Divider() {
    return <div className="divider" />;
}

export default function ToolbarPlugin() {
    const [editor] = useLexicalComposerContext();
    const toolbarRef = useRef(null);
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);

    const activeBlock = useActiveBlock();
    const { toggleBlock } = useBlockFormatting(editor, activeBlock);

    const {
        isBold,
        isItalic,
        isUnderline,
        isStrikethrough,
        isLink,
        updateTextFormatting
    } = useTextFormatting(editor);

    const {
        isNumberedList,
        isBulletedList,
        toggleList,
        updateListFormatting
    } = useListFormatting(editor);

    const { insertLink } = useLinkHandling(editor);

    const $updateToolbar = useCallback(() => {
        updateTextFormatting();
        updateListFormatting();
    }, [updateTextFormatting, updateListFormatting]);

    const handleSave = useDebouncedCallback((content) => {
        console.log(content);
    }, 500);

    useEffect(() => {
        return mergeRegister(
            editor.registerUpdateListener(({ editorState, dirtyElements, dirtyLeaves }) => {
                editorState.read(() => {
                    $updateToolbar();
                });
                if (dirtyElements.size === 0 && dirtyLeaves.size === 0) {
                    return;
                }
                handleSave(JSON.stringify(editorState));
            }),
            editor.registerCommand(
                SELECTION_CHANGE_COMMAND,
                (_payload, _newEditor) => {
                    $updateToolbar();
                    return false;
                },
                LowPriority,
            ),
            editor.registerCommand(
                CAN_UNDO_COMMAND,
                (payload) => {
                    setCanUndo(payload);
                    return false;
                },
                LowPriority,
            ),
            editor.registerCommand(
                CAN_REDO_COMMAND,
                (payload) => {
                    setCanRedo(payload);
                    return false;
                },
                LowPriority,
            ),
        );
    }, [editor, $updateToolbar, handleSave]);

    return (
        <div className="toolbar flex flex-wrap" ref={toolbarRef}>
            {/* Undo/Redo buttons */}
            <button
                disabled={!canUndo}
                onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
                className="toolbar-item spaced"
                aria-label="Undo"
            >
                <i className="format undo" />
            </button>
            <button
                disabled={!canRedo}
                onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
                className="toolbar-item"
                aria-label="Redo"
            >
                <i className="format redo" />
            </button>
            <Divider />

            {/* Block formatting buttons */}
            <button
                onClick={() => editor.update(() => toggleBlock('h1'))}
                data-active={activeBlock === 'h1' ? '' : undefined}
                className={'toolbar-item spaced ' + (activeBlock === 'h1' ? 'active' : '')}
            >
                <i className="format h1" />
            </button>
            <button
                onClick={() => editor.update(() => toggleBlock('h2'))}
                data-active={activeBlock === 'h2' ? '' : undefined}
                className={'toolbar-item spaced ' + (activeBlock === 'h2' ? 'active' : '')}
            >
                <i className="format h2" />
            </button>
            <button
                onClick={() => editor.update(() => toggleBlock('h3'))}
                data-active={activeBlock === 'h3' ? '' : undefined}
                className={'toolbar-item spaced ' + (activeBlock === 'h3' ? 'active' : '')}
            >
                <i className="format h3" />
            </button>
            <Divider />

            {/* Text formatting buttons */}
            <button
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
                className={'toolbar-item spaced ' + (isBold ? 'active' : '')}
                aria-label="Format Bold"
            >
                <i className="format bold" />
            </button>
            <button
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
                className={'toolbar-item spaced ' + (isItalic ? 'active' : '')}
                aria-label="Format Italics"
            >
                <i className="format italic" />
            </button>
            <button
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
                className={'toolbar-item spaced ' + (isUnderline ? 'active' : '')}
                aria-label="Format Underline"
            >
                <i className="format underline" />
            </button>
            <button
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')}
                className={'toolbar-item spaced ' + (isStrikethrough ? 'active' : '')}
                aria-label="Format Strikethrough"
            >
                <i className="format strikethrough" />
            </button>
            <Divider />

            {/* Link button */}
            <button
                onClick={insertLink}
                className={'toolbar-item ' + (isLink ? 'active' : '')}
                aria-label="Insert Link"
            >
                <i className="format link" />
            </button>

            {/* Quote and code buttons */}
            <button
                onClick={() => editor.update(() => toggleBlock('quote'))}
                data-active={activeBlock === 'quote' ? '' : undefined}
                className={'toolbar-item spaced ' + (activeBlock === 'quote' ? 'active' : '')}
                aria-label="Blockquote"
            >
                <i className="format quote" />
            </button>
            <button
                onClick={() => editor.update(() => toggleBlock('code'))}
                data-active={activeBlock === 'code' ? '' : undefined}
                className={'toolbar-item spaced ' + (activeBlock === 'code' ? 'active' : '')}
                aria-label="Insert code block"
            >
                <i className="format code" />
            </button>

            <ImagePlugin />
            <Divider />

            {/* List buttons */}
            <button
                onClick={() => toggleList('number')}
                className={'toolbar-item ' + (isNumberedList ? 'active' : '')}
                aria-label="Numbered List"
            >
                <i className="format numbered-list" />
            </button>
            <button
                onClick={() => toggleList('bullet')}
                className={'toolbar-item ' + (isBulletedList ? 'active' : '')}
                aria-label="Bulleted List"
            >
                <i className="format bulleted-list" />
            </button>
            <Divider />

            {/* Alignment buttons */}
            <button
                onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')}
                className="toolbar-item spaced"
                aria-label="Left Align"
            >
                <i className="format left-align" />
            </button>
            <button
                onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')}
                className="toolbar-item spaced"
                aria-label="Center Align"
            >
                <i className="format center-align" />
            </button>
            <button
                onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')}
                className="toolbar-item spaced"
                aria-label="Right Align"
            >
                <i className="format right-align" />
            </button>
            <button
                onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify')}
                className="toolbar-item"
                aria-label="Justify Align"
            >
                <i className="format justify-align" />
            </button>
        </div>
    );
}