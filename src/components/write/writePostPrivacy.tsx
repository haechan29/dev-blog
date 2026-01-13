'use client';

import useWritePostForm from '@/features/write/hooks/useWritePostForm';
import { AppDispatch } from '@/lib/redux/store';
import { setIsPrivate } from '@/lib/redux/write/writePostFormSlice';
import clsx from 'clsx';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

export default function WritePostPrivacy() {
  const {
    writePostForm: { isPrivate },
  } = useWritePostForm();
  const dispatch = useDispatch<AppDispatch>();

  const onToggle = useCallback(() => {
    dispatch(setIsPrivate(!isPrivate));
  }, [dispatch, isPrivate]);

  return (
    <div className='flex justify-end items-center gap-3 p-2'>
      <span className='text-gray-900 text-sm'>나만 보기</span>
      <button
        onClick={onToggle}
        aria-label={isPrivate ? '나만 보기 해제' : '나만 보기 설정'}
        className={clsx(
          'relative w-11 h-6 rounded-full transition-colors duration-200 hover:opacity-80',
          isPrivate ? 'bg-blue-500' : 'bg-gray-300'
        )}
      >
        <div
          className={clsx(
            'absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200',
            isPrivate ? 'translate-x-5.5' : 'translate-x-0.5'
          )}
        />
      </button>
    </div>
  );
}
