'use client';

import { WritePostFormProps } from '@/features/write/ui/writePostFormProps';
import { WritePostValidityProps } from '@/features/write/ui/writePostValidityProps';
import clsx from 'clsx';
import { ChangeEvent, useCallback, useMemo, useRef, useState } from 'react';

const MAX_TITLE_LENGTH = 50;

export default function WritePostTitle({
  writePostForm: { title },
  writePostValidity: { invalidField },
  setTitle,
  setShouldValidate,
}: {
  writePostForm: WritePostFormProps;
  writePostValidity: WritePostValidityProps;
  setTitle: (title: string) => void;
  setShouldValidate: (shouldValidate: boolean) => void;
}) {
  const [isFocused, setIsFocused] = useState(false);
  const isInvalid = useMemo(() => invalidField === 'title', [invalidField]);
  const titleRef = useRef<HTMLInputElement | null>(null);

  const isTitleTooLong = useMemo(
    () => title.length > MAX_TITLE_LENGTH,
    [title.length]
  );

  const onClick = useCallback(() => titleRef.current?.focus(), []);
  const onFocus = useCallback(() => setIsFocused(true), []);
  const onBlur = useCallback(() => setIsFocused(false), []);
  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setShouldValidate(false);
      setTitle(e.target.value);
    },
    [setShouldValidate, setTitle]
  );

  return (
    <div
      className={clsx(
        'flex border rounded-lg gap-3 px-3 py-4',
        !title && 'bg-gray-50',
        isInvalid || isTitleTooLong
          ? 'border-red-400 animate-shake'
          : isFocused
          ? 'border-blue-500'
          : 'border-gray-200 hover:border-blue-500'
      )}
      onClick={onClick}
    >
      <div className='flex flex-1 min-w-0 overflow-x-auto scrollbar-hide items-center'>
        <div className='w-fit shrink-0 relative text-xl font-semibold'>
          {!title ? (
            <span className='text-gray-400'>제목을 입력하세요</span>
          ) : (
            <>
              <span>{title.slice(0, MAX_TITLE_LENGTH)}</span>
              <span className='text-red-500'>
                {title.slice(MAX_TITLE_LENGTH)}
              </span>
            </>
          )}
          <input
            ref={titleRef}
            type='text'
            onFocus={onFocus}
            onBlur={onBlur}
            value={title}
            onChange={onChange}
            className='absolute z-50 inset-0 outline-none text-transparent caret-gray-900'
          />
        </div>
      </div>

      <div
        className={clsx(
          'flex text-sm gap-0.5 items-center',
          title.length < MAX_TITLE_LENGTH * 0.95 && 'hidden',
          isTitleTooLong && 'text-red-500'
        )}
      >
        <div>{title.length}</div>
        <div>/</div>
        <div>{MAX_TITLE_LENGTH}</div>
      </div>
    </div>
  );
}
