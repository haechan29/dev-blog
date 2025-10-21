'use client';

import clsx from 'clsx';
import { ChangeEvent, RefObject, useCallback } from 'react';

export default function WritePostContentEditor({
  contentEditorRef,
  content,
  isContentValid,
  isError,
  shouldAttachToolbarToBottom,
  setContent,
  setShouldValidate,
  setIsEditorFocused,
}: {
  contentEditorRef: RefObject<HTMLTextAreaElement | null>;
  content: string;
  isContentValid: boolean;
  isError: boolean;
  shouldAttachToolbarToBottom: boolean;
  setContent: (content: string) => void;
  setShouldValidate: (shouldValidate: boolean) => void;
  setIsEditorFocused: (isEditorFocused: boolean) => void;
}) {
  const onChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      setShouldValidate(false);
      setContent(e.target.value);
    },
    [setContent, setShouldValidate]
  );

  return (
    <textarea
      ref={contentEditorRef}
      onFocus={() => setIsEditorFocused(true)}
      onBlur={() => setIsEditorFocused(false)}
      value={content}
      onChange={onChange}
      placeholder='본문을 입력하세요'
      className={clsx(
        'w-full h-full p-4 resize-none outline-none border',
        shouldAttachToolbarToBottom ? 'rounded-lg' : 'rounded-b-lg',
        isContentValid && !isError
          ? 'border-gray-200 hover:border-blue-500 focus:border-blue-500'
          : 'border-red-400 animate-shake',
        content || 'bg-gray-50'
      )}
    />
  );
}
