'use client';

import clsx from 'clsx';
import { ChangeEvent, RefObject, useCallback, useMemo } from 'react';

const MAX_CONTENT_LENGTH = 50_000;

export default function WritePostContentEditor({
  contentEditorRef,
  content,
  isInvalid,
  isError,
  shouldAttachToolbarToBottom,
  setContent,
  setShouldValidate,
  setIsEditorFocused,
}: {
  contentEditorRef: RefObject<HTMLTextAreaElement | null>;
  content: string;
  isInvalid: boolean;
  isError: boolean;
  shouldAttachToolbarToBottom: boolean;
  setContent: (content: string) => void;
  setShouldValidate: (shouldValidate: boolean) => void;
  setIsEditorFocused: (isEditorFocused: boolean) => void;
}) {
  const isContentTooLong = useMemo(
    () => content.length > MAX_CONTENT_LENGTH,
    [content.length]
  );
  const onChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      setShouldValidate(false);
      setContent(e.target.value);
    },
    [setContent, setShouldValidate]
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
          !isInvalid && !isError && !isContentTooLong
            ? 'border-gray-200 hover:border-blue-500 focus:border-blue-500'
            : 'border-red-400 animate-shake',
          !content && 'bg-gray-50'
        )}
      />
      <div
        className={clsx(
          'flex justify-end items-center gap-1 text-sm p-2',
          content.length < MAX_CONTENT_LENGTH * 0.95 && 'hidden',
          isContentTooLong && 'text-red-500'
        )}
      >
        <div>{content.length.toLocaleString()}</div>
        <div>/</div>
        <div>{MAX_CONTENT_LENGTH.toLocaleString()}</div>
      </div>
    </div>
  );
}
