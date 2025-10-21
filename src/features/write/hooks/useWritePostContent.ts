'use client';

import { WritePostContent } from '@/features/write/domain/model/writePostContent';
import { writePostContentButtons } from '@/features/write/domain/model/writePostContentButton';
import { WritePostContentToolbar } from '@/features/write/domain/model/writePostContentToolbar';
import { WritePostContentButtonProps } from '@/features/write/ui/writePostContentButtonProps';
import { createProps } from '@/features/write/ui/writePostContentProps';
import useKeyboardHeight from '@/hooks/useKeyboardHeight';
import { canTouch } from '@/lib/browser';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import toast from 'react-hot-toast';

type MarkdownParams = {
  textBefore: string;
  selectedText: string;
  textAfter: string;
  markdownBefore: string;
  markdownAfter?: string;
};

export default function useWritePostContent({
  content,
  setContent,
}: {
  content: string;
  setContent: (content: string) => void;
}) {
  const [contentToolbar, setContentToolbar] = useState<WritePostContentToolbar>(
    {
      isEditorFocused: false,
      canTouch: false,
      keyboardHeight: 0,
    }
  );

  const writePostContent = useMemo<WritePostContent>(
    () => ({
      contentToolbar,
      contentButtons: writePostContentButtons,
    }),
    [contentToolbar]
  );
  const { keyboardHeight } = useKeyboardHeight();

  const writePostContentProps = useMemo(
    () => createProps(writePostContent),
    [writePostContent]
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

  const setIsEditorFocused = useCallback((isEditorFocused: boolean) => {
    toast.success(`${isEditorFocused}`);
    setContentToolbar(prev => ({ ...prev, isEditorFocused }));
  }, []);

  useLayoutEffect(() => {
    setContentToolbar(prev => ({
      ...prev,
      canTouch: canTouch,
    }));
  }, []);

  useEffect(() => {
    setContentToolbar(prev => ({
      ...prev,
      keyboardHeight: keyboardHeight ?? 0,
    }));
  }, [keyboardHeight]);

  return {
    writePostContent: writePostContentProps,
    contentEditorRef,
    onAction,
    setIsEditorFocused,
  } as const;
}
