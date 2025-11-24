'use client';

import useWritePostForm from '@/features/write/hooks/useWritePostForm';
import { AppDispatch } from '@/lib/redux/store';
import {
  setInvalidField,
  setTitle,
} from '@/lib/redux/write/writePostFormSlice';
import clsx from 'clsx';
import {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useDispatch } from 'react-redux';

export default function WritePostTitle() {
  const {
    writePostForm: {
      title: { value: title, isUserInput, isValid, maxLength },
    },
  } = useWritePostForm();
  const [titleInner, setTitleInner] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const [isFocused, setIsFocused] = useState(false);
  const isTitleTooLong = useMemo(
    () => titleInner.length > maxLength,
    [maxLength, titleInner.length]
  );
  const titleRef = useRef<HTMLInputElement | null>(null);

  const onClick = useCallback(() => titleRef.current?.focus(), []);
  const onFocus = useCallback(() => setIsFocused(true), []);
  const onBlur = useCallback(() => setIsFocused(false), []);
  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      dispatch(setInvalidField(null));
      setTitleInner(e.currentTarget.value);
    },
    [dispatch]
  );

  useEffect(() => {
    if (!isFocused) {
      const newTitle = titleInner.slice(0, maxLength);
      setTitleInner(newTitle);
    }
  }, [dispatch, isFocused, maxLength, titleInner]);

  useEffect(() => {
    dispatch(setTitle({ value: titleInner, isUserInput: true }));
  }, [dispatch, titleInner]);

  useEffect(() => {
    if (!isUserInput) {
      setTitleInner(title);
    }
  }, [isUserInput, title]);

  return (
    <div
      className={clsx(
        'flex border rounded-lg gap-3 px-3 py-4',
        !titleInner && 'bg-gray-50',
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
          {!titleInner ? (
            <span className='text-gray-400'>제목을 입력하세요</span>
          ) : (
            <>
              <span>{titleInner.slice(0, maxLength)}</span>
              <span className='text-red-500'>
                {titleInner.slice(maxLength)}
              </span>
            </>
          )}
          <input
            ref={titleRef}
            type='text'
            onFocus={onFocus}
            onBlur={onBlur}
            value={titleInner}
            onChange={onChange}
            className='absolute z-50 inset-0 outline-none text-transparent caret-gray-900'
          />
        </div>
      </div>

      <div
        className={clsx(
          'flex text-sm gap-0.5 items-center',
          (!isFocused || titleInner.length < maxLength * 0.95) && 'hidden',
          isTitleTooLong && 'text-red-500'
        )}
      >
        <div>{titleInner.length}</div>
        <div>/</div>
        <div>{maxLength}</div>
      </div>
    </div>
  );
}
