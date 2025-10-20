'use client';

import { processMd } from '@/lib/md';
import { useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

export default function WritePostPreview({ content }: { content: string }) {
  const [htmlSource, setHtmlSource] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const parseMd = async () => {
      setError(null);
      try {
        const result = await processMd(content);
        setHtmlSource(result);
      } catch (error) {
        setError('마크다운 파싱 에러');
        setHtmlSource(null);
      }
    };

    parseMd();
  }, [content]);

  return (
    <div className='w-full min-h-screen border border-gray-200 rounded-lg bg-white'>
      <div className='p-3 border-b border-gray-200 font-semibold text-sm text-gray-600'>
        미리보기
      </div>
      <div className='p-4'>
        {htmlSource ? (
          <ErrorBoundary fallback={<div></div>}>
            <div
              className='prose'
              dangerouslySetInnerHTML={{ __html: htmlSource }}
            />
          </ErrorBoundary>
        ) : (
          <p className='text-gray-400'>본문을 입력하면 미리보기가 표시됩니다</p>
        )}
      </div>
    </div>
  );
}
