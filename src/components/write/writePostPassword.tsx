'use client';

import useWritePost from '@/features/write/hooks/useWritePost';
import { AppDispatch } from '@/lib/redux/store';
import { setInvalidField, setPassword } from '@/lib/redux/writePostSlice';
import clsx from 'clsx';
import { Eye, EyeOff } from 'lucide-react';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';

export default function WritePostPassword() {
  const {
    writePost: {
      writePostForm: {
        password: { value: password, maxLength, isValid },
      },
    },
  } = useWritePost();
  const dispatch = useDispatch<AppDispatch>();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const isPasswordTooLong = useMemo(
    () => password.length > maxLength,
    [maxLength, password.length]
  );

  const onFocus = useCallback(() => setIsFocused(true), []);
  const onBlur = useCallback(() => setIsFocused(false), []);
  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      dispatch(setInvalidField(null));
      dispatch(setPassword(e.currentTarget.value));
    },
    [dispatch]
  );

  useEffect(() => {
    if (!isFocused) {
      dispatch(setPassword(password.slice(0, maxLength)));
    }
  }, [dispatch, isFocused, maxLength, password]);

  return (
    <div
      className={clsx(
        'flex border rounded-lg gap-3 p-3',
        !isPasswordVisible && !password && 'bg-gray-50',
        !isValid || isPasswordTooLong
          ? 'border-red-400 animate-shake'
          : isFocused
          ? 'border-blue-500'
          : 'border-gray-200 hover:border-blue-500'
      )}
    >
      <input
        type={isPasswordVisible ? 'text' : 'password'}
        onFocus={onFocus}
        onBlur={onBlur}
        value={password}
        onChange={onChange}
        placeholder='비밀번호'
        className='flex-1 min-w-0 text-sm outline-none'
      />

      <div
        className={clsx(
          'flex text-sm gap-0.5 items-center',
          (!isFocused || password.length < maxLength * 0.95) && 'hidden',
          isPasswordTooLong && 'text-red-500'
        )}
      >
        <div>{password.length}</div>
        <div>/</div>
        <div>{maxLength}</div>
      </div>

      <button
        onClick={() => setIsPasswordVisible(prev => !prev)}
        className='flex shrink-0 p-2 -m-2 justify-center items-center'
      >
        {isPasswordVisible ? (
          <EyeOff className='w-5 h-5 text-gray-700' />
        ) : (
          <Eye className='w-5 h-5 text-gray-700' />
        )}
      </button>
    </div>
  );
}
