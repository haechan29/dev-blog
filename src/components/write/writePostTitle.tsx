'use client';

import clsx from 'clsx';
import { useState } from 'react';

export default function WritePostTitle() {
  const [title, setTitle] = useState('');
  const [isTitleValid, setIsTitleValid] = useState(true);

  return (
    <div className='mb-4'>
      <input
        type='text'
        value={title}
        onChange={e => {
          setIsTitleValid(true);
          setTitle(e.target.value);
        }}
        placeholder='제목을 입력하세요'
        className={clsx(
          'w-full p-4 text-2xl font-bold outline-none border rounded-lg',
          isTitleValid
            ? 'border-gray-200 hover:border-blue-500 focus:border-blue-500'
            : 'border-red-400 animate-shake',
          title ? 'bg-white' : 'bg-gray-50'
        )}
      />
    </div>
  );
}
