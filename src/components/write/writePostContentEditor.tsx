'use client';

import { Content } from '@/features/write/domain/types/content';
import clsx from 'clsx';
import { ChangeEvent, RefObject, useCallback, useMemo } from 'react';

export default function WritePostContentEditor({
  contentEditorRef,
  parsedContent,
  value: content,
  maxLength,
  isValid,
  shouldAttachToolbarToBottom,
  setContent,
  resetInvalidField,
  setIsEditorFocused,
}: {
  contentEditorRef: RefObject<HTMLTextAreaElement | null>;
  parsedContent: Content;
  value: string;
  maxLength: number;
  isValid: boolean;
  shouldAttachToolbarToBottom: boolean;
  setContent: (content: string) => void;
  resetInvalidField: () => void;
  setIsEditorFocused: (isEditorFocused: boolean) => void;
}) {
  const isError = useMemo(() => {
    return parsedContent.status === 'error';
  }, [parsedContent.status]);

  const isContentTooLong = useMemo(
    () => content.length > maxLength,
    [content.length, maxLength]
  );

  const onChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      resetInvalidField();
      setContent(e.target.value);
    },
    [resetInvalidField, setContent]
  );

  return (
    <div className='flex flex-col h-full'>
      <textarea
        ref={contentEditorRef}
        onFocus={() => setIsEditorFocused(true)}
        onBlur={() => setIsEditorFocused(false)}
        value={content}
        onChange={onChange}
        placeholder='본문을 입력하세요'
        className={clsx(
          'flex-1 min-h-0 p-4 resize-none outline-none border',
          shouldAttachToolbarToBottom ? 'rounded-lg' : 'rounded-b-lg',
          isValid && !isError && !isContentTooLong
            ? 'border-gray-200 hover:border-blue-500 focus:border-blue-500'
            : 'border-red-400 animate-shake',
          !content && 'bg-gray-50'
        )}
      />
      <div
        className={clsx(
          'flex justify-end items-center gap-1 text-sm p-2',
          content.length < maxLength * 0.95 && 'hidden',
          isContentTooLong && 'text-red-500'
        )}
      >
        <div>{content.length.toLocaleString()}</div>
        <div>/</div>
        <div>{maxLength.toLocaleString()}</div>
      </div>
    </div>
  );
}
