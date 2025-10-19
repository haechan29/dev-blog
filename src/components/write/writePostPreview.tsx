'use client';

import { mdxComponents } from '@/lib/mdxComponents';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

export default function WritePostPreview({ content }: { content: string }) {
  const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const parseMdx = async () => {
      if (!content.trim()) {
        setMdxSource(null);
        return;
      }

      setError(null);
      try {
        const source = await serialize(content);
        setMdxSource(source);
      } catch (err) {
        setError('MDX 파싱 에러');
        setMdxSource(null);
      }
    };

    parseMdx();
  }, [content]);

  return (
    <div className='w-full min-h-screen border border-gray-200 rounded-lg bg-white'>
      <div className='p-3 border-b border-gray-200 font-semibold text-sm text-gray-600'>
        미리보기
      </div>
      <div className='p-4'>
        {mdxSource ? (
          <ErrorBoundary fallback={<div></div>}>
            <div className='prose'>
              <MDXRemote {...mdxSource} components={mdxComponents} />
            </div>
          </ErrorBoundary>
        ) : (
          <p className='text-gray-400'>본문을 입력하면 미리보기가 표시됩니다</p>
        )}
      </div>
    </div>
  );
}
