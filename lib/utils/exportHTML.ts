// utils/exportHtml.ts
import { $generateHtmlFromNodes } from '@lexical/html';
import { $getRoot, $isRangeSelection, $createRangeSelection, LexicalEditor } from 'lexical';

export function exportEditorContent(editor: LexicalEditor, selectionOnly = false): string {
  return editor.getEditorState().read(() => {
    let selection = null;
    
    if (selectionOnly) {
      selection = editor._pendingEditorState && $isRangeSelection(editor._pendingEditorState._selection) 
        ? editor._pendingEditorState._selection
        : $createRangeSelection();
    }

    return $generateHtmlFromNodes(editor, selection);
  });
}