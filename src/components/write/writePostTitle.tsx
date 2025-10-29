'use client';

import { WritePostFormProps } from '@/features/write/ui/writePostFormProps';
import { SetState } from '@/types/react';
import clsx from 'clsx';
import {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

export default function WritePostTitle({
  title: { value: title, isValid, maxLength },
  setTitle,
  resetInvalidField,
}: {
  title: WritePostFormProps['title'];
  setTitle: SetState<string>;
  resetInvalidField: () => void;
}) {
  const [isFocused, setIsFocused] = useState(false);
  const isTitleTooLong = useMemo(
    () => title.length > maxLength,
    [maxLength, title.length]
  );
  const titleRef = useRef<HTMLInputElement | null>(null);

  const onClick = useCallback(() => titleRef.current?.focus(), []);
  const onFocus = useCallback(() => setIsFocused(true), []);
  const onBlur = useCallback(() => setIsFocused(false), []);
  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      resetInvalidField();
      setTitle(e.target.value);
    },
    [resetInvalidField, setTitle]
  );

  useEffect(() => {
    if (!isFocused) {
      setTitle(prev => prev.slice(0, maxLength));
    }
  }, [isFocused, maxLength, setTitle]);

  return (
    <div
      className={clsx(
        'flex border rounded-lg gap-3 px-3 py-4',
        !title && 'bg-gray-50',
        !isValid || isTitleTooLong
          ? 'border-red-400 animate-shake'
          : isFocused
          ? 'border-blue-500'
          : 'border-gray-200 hover:border-blue-500'
      )}
      onClick={onClick}
    >
      <div className='flex flex-1 min-w-0 overflow-x-auto scrollbar-hide items-center'>
        <div className='shrink-0 relative text-xl font-semibold'>
          {!title ? (
            <span className='text-gray-400'>제목을 입력하세요</span>
          ) : (
            <>
              <span>{title.slice(0, maxLength)}</span>
              <span className='text-red-500'>{title.slice(maxLength)}</span>
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
          (!isFocused || title.length < maxLength * 0.95) && 'hidden',
          isTitleTooLong && 'text-red-500'
        )}
      >
        <div>{title.length}</div>
        <div>/</div>
        <div>{maxLength}</div>
      </div>
    </div>
  );
}
