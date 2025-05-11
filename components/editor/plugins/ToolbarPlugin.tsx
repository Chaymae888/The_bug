
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import { useDebouncedCallback } from 'use-debounce';
import {
  $createParagraphNode,
  $isRootOrShadowRoot,
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
  $createTextNode,
} from 'lexical';
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
} from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import { $findMatchingParent } from '@lexical/utils';
import React from 'react';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { 
  $insertList,
  $removeList,
  INSERT_ORDERED_LIST_COMMAND, 
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  $isListNode
} from '@lexical/list';

import { 
  $createLinkNode,
  $isLinkNode,
  TOGGLE_LINK_COMMAND,
} from '@lexical/link';
import { $createCodeNode } from '@lexical/code';
import ImagePlugin from '@/plugins/ImagePlugin';
const LowPriority = 1;

function Divider() {
  return <div className="divider" />;
}

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isNumberedList, setIsNumberedList] = useState(false);
  const [isBulletedList, setIsBulletedList] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const activeBlock = useActiveBlock();

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      // Update text format
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
      

      const anchorNode = selection.anchor.getNode();
      setIsLink($isLinkNode(anchorNode));
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

  const insertLink = useCallback(() => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;
  
      const text = selection.getTextContent() || 'Link';
      let url = prompt('Enter URL:', 'https://');
      
      // Validate URL
      if (!url) return;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
  
      // Create link node
      const linkNode = $createLinkNode(url, {
        rel: 'noopener noreferrer',
        target: '_blank',
        title: url,
      });
      
      // Insert link
      if (selection.isCollapsed()) {
        linkNode.append($createTextNode(text));
        selection.insertNodes([linkNode]);
      } else {
        selection.insertNodes([linkNode]);
      }
    });
  }, [editor]);

  const toggleList = useCallback((listType: 'number' | 'bullet') => {
    editor.update(() => {
      const selection = $getSelection();
      
      if ($isRangeSelection(selection)) {
        const anchorNode = selection.anchor.getNode();
        const element = anchorNode.getTopLevelElement();
        
        if ($isListNode(element)) {
          // Already in a list - toggle type or remove
          if (element.getListType() === listType) {
            editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
          } else {
            element.setListType(listType);
          }
        } else {
          // Not in a list - insert new list
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

  const handleSave= useDebouncedCallback((content) => {console.log(content)}, 500);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState, dirtyElements,dirtyLeaves }) => {
        editorState.read(() => {
          $updateToolbar();
        });
        if(dirtyElements.size===0 && dirtyLeaves.size===0) {
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
      editor.registerCommand(
        INSERT_ORDERED_LIST_COMMAND,
        () => {
          $insertList('number');
          return true;
        },
        LowPriority
      ),
      editor.registerCommand(
        INSERT_UNORDERED_LIST_COMMAND,
        () => {
          $insertList('bullet');
          return true;
        },
        LowPriority
      ),
      editor.registerCommand(
        REMOVE_LIST_COMMAND,
        () => {
          $removeList();
          return true;
        },
        LowPriority
      ),
    );
  }, [editor, $updateToolbar]);

  function toggleBlock(type: 'h1' | 'h2' | 'h3' | 'quote' | 'code') {
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
  }

  return (
    <div className="toolbar flex flex-wrap" ref={toolbarRef}>
      <button
        disabled={!canUndo}
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
        className="toolbar-item spaced"
        aria-label="Undo"
      >
        <i className="format undo" />
      </button>
      <button
        disabled={!canRedo}
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND, undefined);
        }}
        className="toolbar-item"
        aria-label="Redo"
      >
        <i className="format redo" />
      </button>
      <Divider />
      <button
        onClick={() => editor.update(() => toggleBlock('h1'))}
        data-active={activeBlock === 'h1' ? '' : undefined}
        className={
          'toolbar-item spaced ' + (activeBlock === 'h1' ? 'active' : '')
        }
      >
        <i className="format h1" />
      </button>
      <button
        onClick={() => editor.update(() => toggleBlock('h2'))}
        data-active={activeBlock === 'h2' ? '' : undefined}
        className={
          'toolbar-item spaced ' + (activeBlock === 'h2' ? 'active' : '')
        }
      >
        <i className="format h2" />
      </button>
      <button
        onClick={() => editor.update(() => toggleBlock('h3'))}
        data-active={activeBlock === 'h3' ? '' : undefined}
        className={
          'toolbar-item spaced ' + (activeBlock === 'h3' ? 'active' : '')
        }
      >
        <i className="format h3" />
      </button>
      <Divider />
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
        }}
        className={'toolbar-item spaced ' + (isBold ? 'active' : '')}
        aria-label="Format Bold"
      >
        <i className="format bold" />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
        }}
        className={'toolbar-item spaced ' + (isItalic ? 'active' : '')}
        aria-label="Format Italics"
      >
        <i className="format italic" />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
          setIsUnderline(!isUnderline);
        }}
        className={'toolbar-item spaced ' + (isUnderline ? 'active' : '')}
        aria-label="Format Underline"
      >
        <i className="format underline" />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
          setIsStrikethrough(!isStrikethrough);
        }}
        className={'toolbar-item spaced ' + (isStrikethrough ? 'active' : '')}
        aria-label="Format Strikethrough"
      >
        <i className="format strikethrough" />
      </button>
      <Divider />
      <button
      onClick={insertLink}
      className={'toolbar-item ' + (isLink ? 'active' : '')}
      aria-label="Insert Link"
    >
      <i className="format link" /> 
    </button>
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
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
        }}
        className="toolbar-item spaced"
        aria-label="Left Align"
      >
        <i className="format left-align" />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
        }}
        className="toolbar-item spaced"
        aria-label="Center Align"
      >
        <i className="format center-align" />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
        }}
        className="toolbar-item spaced"
        aria-label="Right Align"
      >
        <i className="format right-align" />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify');
        }}
        className="toolbar-item"
        aria-label="Justify Align"
      >
        <i className="format justify-align" />
      </button>{' '}
    </div>
  );
}

function useActiveBlock() {
  const [editor] = useLexicalComposerContext();

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      return editor.registerUpdateListener(onStoreChange);
    },
    [editor],
  );

  const getSnapshot = useCallback(() => {
    return editor.getEditorState().read(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return null;

      const anchor = selection.anchor.getNode();
      let element =
        anchor.getKey() === 'root'
          ? anchor
          : $findMatchingParent(anchor, (e) => {
              const parent = e.getParent();
              return parent !== null && $isRootOrShadowRoot(parent);
            });

      if (element === null) {
        element = anchor.getTopLevelElementOrThrow();
      }

      if ($isHeadingNode(element)) {
        return element.getTag();
      }

      return element.getType();
    });
  }, [editor]);

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
