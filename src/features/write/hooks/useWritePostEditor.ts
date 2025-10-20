'use client';

import { writePostEditors } from '@/features/write/domain/model/writePostEditor';
import {
  createProps,
  WritePostEditorProps,
} from '@/features/write/ui/writePostEditorProps';
import { useCallback, useMemo, useRef } from 'react';

type MarkdownParams = {
  textBefore: string;
  selectedText: string;
  textAfter: string;
  markdownBefore: string;
  markdownAfter?: string;
};

export default function useWritePostEditor({
  content,
  setContent,
}: {
  content: string;
  setContent: (content: string) => void;
}) {
  const writePostEditorProps = useMemo(
    () => writePostEditors.map(createProps),
    []
  );

  const contentEditorRef = useRef<HTMLTextAreaElement | null>(null);

  const insertMarkdown = useCallback(
    ({
      textBefore,
      selectedText,
      textAfter,
      markdownBefore,
      markdownAfter = '',
    }: MarkdownParams) => {
      const newText = markdownBefore + selectedText + markdownAfter;
      const newCursorPosition = selectedText
        ? textBefore.length + newText.length
        : textBefore.length + markdownBefore.length;
      return { newText: textBefore + newText + textAfter, newCursorPosition };
    },
    []
  );

  const removeMarkdown = useCallback(
    ({
      textBefore,
      selectedText,
      textAfter,
      markdownBefore,
      markdownAfter = '',
    }: MarkdownParams) => {
      const newText = selectedText
        ? textBefore +
          selectedText.slice(markdownBefore.length, -markdownAfter.length) +
          textAfter
        : textBefore.slice(0, -markdownBefore.length) +
          textAfter.slice(markdownAfter.length);
      const newCursorPosition = selectedText
        ? newText.length - textAfter.length
        : textBefore.length - markdownBefore.length;
      return { newText, newCursorPosition } as const;
    },
    []
  );

  const onAction = useCallback(
    ({
      actionType,
      markdownBefore,
      markdownAfter = '',
    }: WritePostEditorProps) => {
      if (!contentEditorRef.current) return;
      const contentEditor = contentEditorRef.current;

      const [start, end] = [
        contentEditor.selectionStart,
        contentEditor.selectionEnd,
      ];
      const [textBefore, selectedText, textAfter] = [
        content.substring(0, start),
        content.substring(start, end),
        content.substring(end),
      ];
      const isWrapped = selectedText
        ? selectedText.length >=
            markdownBefore.length + (markdownAfter?.length ?? 0) &&
          selectedText.startsWith(markdownBefore) &&
          selectedText.endsWith(markdownAfter)
        : textBefore.endsWith(markdownBefore) &&
          textAfter.startsWith(markdownAfter);

      const shouldInsert = actionType === 'insert' || !isWrapped;
      const { newText, newCursorPosition } = shouldInsert
        ? insertMarkdown({
            textBefore,
            selectedText,
            textAfter,
            markdownBefore,
            markdownAfter,
          })
        : removeMarkdown({
            textBefore,
            selectedText,
            textAfter,
            markdownBefore,
            markdownAfter,
          });
      setContent(newText);
      setTimeout(() => {
        contentEditor.focus();
        contentEditor.setSelectionRange(newCursorPosition, newCursorPosition);
      }, 0);
    },
    [content, insertMarkdown, removeMarkdown, setContent]
  );

  return {
    writePostEditors: writePostEditorProps,
    contentEditorRef,
    onAction,
  } as const;
}
