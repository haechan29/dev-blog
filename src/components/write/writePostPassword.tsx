'use client';

import clsx from 'clsx';
import { useState } from 'react';

export default function WritePostPassword() {
  const [password, setPassword] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(true);

  return (
    <div className='mb-4'>
      <input
        type='password'
        value={password}
        onChange={e => {
          setIsPasswordValid(true);
          setPassword(e.target.value);
        }}
        placeholder='비밀번호'
        className={clsx(
          'w-full p-3 outline-none border rounded-lg',
          isPasswordValid
            ? 'border-gray-200 hover:border-blue-500 focus:border-blue-500'
            : 'border-red-400 animate-shake',
          password ? 'bg-white' : 'bg-gray-50'
        )}
      />
    </div>
  );
}
