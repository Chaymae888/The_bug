import {$getSelection, $isRangeSelection, LexicalEditor} from 'lexical';
import { $isLinkNode } from '@lexical/link';
import {useCallback, useState} from "react";

export function useTextFormatting(editor:  LexicalEditor) {
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isLink, setIsLink] = useState(false);

  const updateTextFormatting = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));

      const anchorNode = selection.anchor.getNode();
      setIsLink($isLinkNode(anchorNode));
    }
  }, []);

  return {
    isBold,
    setIsBold,
    isItalic,
    setIsItalic,
    isUnderline,
    setIsUnderline,
    isStrikethrough,
    setIsStrikethrough,
    isLink,
    setIsLink,
    updateTextFormatting
  };
}