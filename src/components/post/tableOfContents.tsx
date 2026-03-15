'use client';

import Heading from '@/features/post/domain/types/heading';
import clsx from 'clsx';
import { useMemo } from 'react';

export default function TableOfContents({
  headings,
  currentHeadingId = null,
  onItemClick,
  showPlaceholder = false,
}: {
  headings: Heading[];
  currentHeadingId?: string | null;
  onItemClick?: (heading: Heading) => void;
  showPlaceholder?: boolean;
}) {
  const minLevel = useMemo(
    () => (headings.length > 0 ? Math.min(...headings.map(h => h.level)) : 1),
    [headings]
  );

  if (headings.length === 0) {
    if (!showPlaceholder) return null;
    return (
      <div
        className={clsx(
          'w-full xl:w-(--toc-width) p-4 xl:m-(--toc-margin) border border-gray-200',
          'xl:fixed xl:right-0 xl:top-1/2 xl:transform xl:-translate-y-1/2'
        )}
      >
        <p className='text-sm text-gray-400'>
          제목을 추가하면 목차가 표시됩니다
        </p>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'w-full xl:w-(--toc-width) p-4 xl:m-(--toc-margin) border border-gray-200',
        'xl:fixed xl:right-0 xl:top-1/2 xl:transform xl:-translate-y-1/2'
      )}
    >
      <ul className='space-y-2'>
        {headings.map(heading => (
          <li key={heading.id}>
            <button
              onClick={() => onItemClick?.(heading)}
              style={{
                '--indent': `${(heading.level - minLevel) * 0.5}rem`,
              }}
              className={clsx(
                'w-full text-left text-sm hover:text-blue-500 truncate pl-(--indent)',
                currentHeadingId === heading.id
                  ? 'text-blue-500'
                  : 'text-gray-500'
              )}
            >
              {heading.textContent}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
