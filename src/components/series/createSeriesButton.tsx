'use client';

import CreateSeriesDialog from '@/components/series/createSeriesDialog';
import { useState } from 'react';

export default function CreateSeriesButton({ userId }: { userId: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
      >
        새 시리즈
      </button>

      <CreateSeriesDialog
        userId={userId}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </>
  );
}
