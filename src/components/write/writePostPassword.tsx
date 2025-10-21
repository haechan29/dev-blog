'use client';

import { WritePostFormProps } from '@/features/write/ui/writePostFormProps';
import { WritePostValidityProps } from '@/features/write/ui/writePostValidityProps';
import clsx from 'clsx';
import { ChangeEvent, useCallback, useMemo } from 'react';

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
  const isInvalid = useMemo(() => invalidMeta === 'password', [invalidMeta]);

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setShouldValidate(false);
      setPassword(e.target.value);
    },
    [setPassword, setShouldValidate]
  );

  return (
    <input
      type='password'
      value={password}
      onChange={onChange}
      placeholder='비밀번호'
      className={clsx(
        'w-full p-3 text-sm outline-none border rounded-lg',
        isInvalid
          ? 'border-red-400 animate-shake'
          : 'border-gray-200 hover:border-blue-500 focus:border-blue-500',
        password || 'bg-gray-50'
      )}
    />
  );
}
