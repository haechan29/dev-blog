'use client';

import { writePostContentButtons } from '@/features/write/domain/model/writePostContentButton';
import {
  createProps,
  WritePostContentButtonProps,
} from '@/features/write/ui/writePostContentButtonProps';
import { RefObject, useCallback, useMemo, useState } from 'react';

type MarkdownParams = {
  textBefore: string;
  selectedText: string;
  textAfter: string;
  markdownBefore: string;
  markdownAfter?: string;
};

export default function useWritePostContentButton({
  value: content,
  contentEditorRef,
  setContent,
}: {
  value: string;
  contentEditorRef: RefObject<HTMLTextAreaElement | null>;
  setContent: (content: string) => void;
}) {
  const [contentButtons] = useState(writePostContentButtons);
  const contentButtonProps = useMemo(
    () => contentButtons.map(createProps),
    [contentButtons]
  );

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
      action,
      markdownBefore,
      markdownAfter = '',
    }: WritePostContentButtonProps) => {
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

      const shouldInsert = action === 'insert' || !isWrapped;
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
    [content, contentEditorRef, insertMarkdown, removeMarkdown, setContent]
  );

  return {
    contentButtons: contentButtonProps,
    onAction,
  } as const;
}
