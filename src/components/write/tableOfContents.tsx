'use client';

import clsx from 'clsx';
import { useMemo } from 'react';

export interface TocAnchor {
  id: string;
  textContent: string;
  level: number;
  isActive: boolean;
  isScrolledOver: boolean;
  pos: number;
  dom: HTMLElement;
}

export default function TableOfContents({
  anchors,
  showPlaceholder = false,
}: {
  anchors: TocAnchor[];
  showPlaceholder?: boolean;
}) {
  const minLevel = useMemo(
    () => (anchors.length > 0 ? Math.min(...anchors.map(a => a.level)) : 1),
    [anchors]
  );

  const handleClick = (anchor: TocAnchor) => {
    anchor.dom.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  if (anchors.length === 0) {
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
        {anchors.map(anchor => (
          <li key={anchor.id}>
            <button
              onClick={() => handleClick(anchor)}
              style={{
                '--indent': `${(anchor.level - minLevel) * 0.5}rem`,
              }}
              className={clsx(
                'w-full text-left text-sm hover:text-blue-500 truncate pl-(--indent)',
                anchor.isActive ? 'text-blue-500' : 'text-gray-500'
              )}
            >
              {anchor.textContent}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
