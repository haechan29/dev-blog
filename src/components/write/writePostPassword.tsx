'use client';

import { WritePostProps } from '@/features/write/ui/writePostProps';
import clsx from 'clsx';
import { useMemo } from 'react';

export default function WritePostPassword({
  password,
  setPassword,
  invalidField,
}: {
  password: string;
  setPassword: (password: string) => void;
  invalidField: WritePostProps['invalidField'];
}) {
  const isInvalid = useMemo(() => invalidField === 'password', [invalidField]);

  return (
    <div className='mb-4'>
      <input
        type='password'
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder='비밀번호'
        className={clsx(
          'w-full p-3 outline-none border rounded-lg',
          isInvalid
            ? 'border-red-400 animate-shake'
            : 'border-gray-200 hover:border-blue-500 focus:border-blue-500',
          password ? 'bg-white' : 'bg-gray-50'
        )}
      />
    </div>
  );
}
