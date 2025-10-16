'use client';

import clsx from 'clsx';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export default function WritePostToolbar() {
  const router = useRouter();

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handlePublish = useCallback(() => {
    // 발행 로직
  }, []);

  return (
    <div
      className={clsx(
        'sticky top-0 z-40 w-full flex items-center justify-between',
        'p-2 md:p-4 bg-white/80 backdrop-blur-md'
      )}
    >
      <BackButton onClick={handleBack} />
      <PublishButton onClick={handlePublish} />
    </div>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'flex items-center gap-2 py-2 px-4 rounded-lg',
        'text-gray-700 hover:bg-gray-100 font-semibold'
      )}
    >
      <ChevronLeft className='w-5 h-5' />
      <span className='hidden sm:inline'>나가기</span>
    </button>
  );
}

function PublishButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'py-2 px-6 rounded-lg font-semibold',
        'bg-blue-600 text-white hover:bg-blue-500'
      )}
    >
      발행
    </button>
  );
}
