'use client';

import { createOutreachEmail } from '@/features/outreach-email/domain/action/outreachEmailAction';
import { useState } from 'react';

export default function OutreachEmailForm() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    const creatorId = formData.get('creatorId') as string;

    setIsLoading(true);
    try {
      await createOutreachEmail(creatorId, formData);
    } catch (error) {
      console.error(error);
      alert('등록에 실패했습니다');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className='mb-8 p-4 border rounded'>
      <h2 className='text-lg font-semibold mb-4'>이메일 발송 기록</h2>
      <div className='flex flex-col gap-4'>
        <div className='flex gap-4'>
          <div>
            <label className='block text-sm mb-1'>크리에이터 ID</label>
            <input
              name='creatorId'
              type='text'
              required
              className='border p-2 rounded'
            />
          </div>
          <div>
            <label className='block text-sm mb-1'>제목</label>
            <input
              name='subject'
              type='text'
              required
              className='border p-2 rounded w-64'
            />
          </div>
        </div>
        <div>
          <label className='block text-sm mb-1'>본문</label>
          <textarea
            name='body'
            required
            rows={4}
            className='border p-2 rounded w-full'
          />
        </div>
        <button
          type='submit'
          disabled={isLoading}
          className='bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50 w-fit'
        >
          {isLoading ? '등록 중...' : '등록'}
        </button>
      </div>
    </form>
  );
}
