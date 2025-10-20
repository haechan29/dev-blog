'use client';

import { ErrorBoundary } from 'react-error-boundary';

export default function WritePostPreview({
  htmlSource,
}: {
  htmlSource: string | null;
}) {
  return (
    <div className='w-full border lg:border-r lg:border-y border-gray-200 rounded-b-lg lg:rounded-br-lg p-4'>
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
