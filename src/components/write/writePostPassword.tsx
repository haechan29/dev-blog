'use client';

import { WritePostFormProps } from '@/features/write/ui/writePostFormProps';
import { WritePostValidityProps } from '@/features/write/ui/writePostValidityProps';
import clsx from 'clsx';
import { Eye, EyeOff } from 'lucide-react';
import { ChangeEvent, useCallback, useMemo, useState } from 'react';

const MAX_PASSWORD_LENGTH = 20;

export default function WritePostPassword({
  writePostForm: { password },
  writePostValidity: { invalidMeta },
  setPassword,
  setShouldValidate,
}: {
  writePostForm: WritePostFormProps;
  writePostValidity: WritePostValidityProps;
  setPassword: (password: string) => void;
  setShouldValidate: (shouldValidate: boolean) => void;
}) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const isInvalid = useMemo(() => invalidMeta === 'password', [invalidMeta]);

  const isPasswordTooLong = useMemo(
    () => password.length > MAX_PASSWORD_LENGTH,
    [password.length]
  );

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setShouldValidate(false);
      setPassword(e.target.value);
    },
    [setPassword, setShouldValidate]
  );

  return (
    <div
      className={clsx(
        'flex border rounded-lg gap-2',
        !isPasswordVisible && !password && 'bg-gray-50',
        isInvalid || isPasswordTooLong
          ? 'border-red-400 animate-shake'
          : isFocused
          ? 'border-blue-500'
          : 'border-gray-200 hover:border-blue-500'
      )}
    >
      <input
        type={isPasswordVisible ? 'text' : 'password'}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        value={password}
        onChange={onChange}
        placeholder='비밀번호'
        className='flex-1 min-w-0 p-3 text-sm outline-none'
      />

      <div
        className={clsx(
          'flex text-sm gap-0.5 items-center',
          password.length < MAX_PASSWORD_LENGTH * 0.95 && 'hidden',
          isPasswordTooLong && 'text-red-500'
        )}
      >
        <div>{password.length}</div>
        <div>/</div>
        <div>{MAX_PASSWORD_LENGTH}</div>
      </div>

      <button
        onClick={() => setIsPasswordVisible(prev => !prev)}
        className='flex shrink-0 p-2 mr-1 justify-center items-center'
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
