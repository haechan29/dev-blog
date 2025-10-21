'use client';

import clsx from 'clsx';
import { ErrorBoundary } from 'react-error-boundary';

export default function WritePostContentPreview({
  htmlSource,
}: {
  htmlSource: string | null;
}) {
  return (
    <div
      className={clsx(
        'w-full h-full overflow-y-auto p-4',
        'border border-gray-200 rounded-lg'
      )}
    >
      {htmlSource ? (
        <ErrorBoundary fallback={<div>에러가 발생했습니다</div>}>
          <div dangerouslySetInnerHTML={{ __html: htmlSource }} />
        </ErrorBoundary>
      ) : (
        <p className='text-gray-400'>본문을 입력하면 미리보기가 표시됩니다</p>
      )}
    </div>
  );
}
