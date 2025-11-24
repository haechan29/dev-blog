'use client';

import { canTouch } from '@/lib/browser';
import { createRipple } from '@/lib/dom';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error(error);

  return (
    <div className='min-h-screen flex flex-col items-center justify-center text-center px-4'>
      <div className='text-2xl font-bold'>문제가 발생했습니다</div>
      <div className='mt-2 text-gray-600'>잠시 후 다시 시도해주세요.</div>

      {process.env.NODE_ENV === 'development' && (
        <div className='w-full max-w-2xl mt-10 rounded bg-gray-50 p-4 text-left overflow-auto'>
          <p className='text-sm font-semibold text-gray-900 wrap-break-word'>
            {error.message}
          </p>
          {error.digest && (
            <p className='mt-2 text-xs text-gray-500'>Digest: {error.digest}</p>
          )}
          {error.stack && (
            <pre className='mt-4 text-xs text-gray-600 overflow-x-auto'>
              {error.stack}
            </pre>
          )}
        </div>
      )}

      <button
        onClick={e => {
          if (canTouch) createRipple(e);
          reset();
        }}
        className='mt-6 rounded px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 cursor-pointer'
      >
        다시 시도
      </button>
    </div>
  );
}
