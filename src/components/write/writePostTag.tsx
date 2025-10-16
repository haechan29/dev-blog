'use client';

import clsx from 'clsx';
import { useState } from 'react';

export default function WritePostTag() {
  const [tags, setTags] = useState('');
  const [isTagsValid, setIsTagsValid] = useState(true);

  return (
    <div className='mb-4'>
      <input
        type='text'
        value={tags}
        onChange={e => {
          setIsTagsValid(true);
          setTags(e.target.value);
        }}
        placeholder='#태그를 입력하세요'
        className={clsx(
          'w-full p-3 outline-none border rounded-lg',
          isTagsValid
            ? 'border-gray-200 hover:border-blue-500 focus:border-blue-500'
            : 'border-red-400 animate-shake',
          tags ? 'bg-white' : 'bg-gray-50'
        )}
      />
    </div>
  );
}
