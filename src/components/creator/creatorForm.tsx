'use client';

import { createCreator } from '@/features/creator/domain/action/creatorAction';
import { useState } from 'react';

export default function CreatorForm() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    try {
      await createCreator(formData);
    } catch (error) {
      console.error(error);
      alert('등록에 실패했습니다');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className='mb-8 p-4 border rounded'>
      <h2 className='text-lg font-semibold mb-4'>크리에이터 등록</h2>
      <div className='flex gap-4 items-end'>
        <div>
          <label className='block text-sm mb-1'>채널명</label>
          <input
            name='channelName'
            type='text'
            required
            className='border p-2 rounded'
          />
        </div>
        <div>
          <label className='block text-sm mb-1'>이메일</label>
          <input
            name='email'
            type='email'
            required
            className='border p-2 rounded'
          />
        </div>
        <div>
          <label className='block text-sm mb-1'>메모</label>
          <input name='memo' type='text' className='border p-2 rounded' />
        </div>
        <button
          type='submit'
          disabled={isLoading}
          className='bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50'
        >
          {isLoading ? '등록 중...' : '등록'}
        </button>
      </div>
    </form>
  );
}
