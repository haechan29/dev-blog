'use client';

import { Heading } from '@/features/post/domain/model/post';
import useMediaQuery from '@/hooks/useMediaQuery';
import useThrottle from '@/hooks/useThrottle';
import clsx from 'clsx';
import { useCallback, useEffect, useState } from 'react';

export default function TableOfContentsItem({
  headings,
}: {
  headings: Heading[];
}) {
  const [activeId, setActiveId] = useState<string>('');
  const throttle = useThrottle();
  const isLargerThanXl = useMediaQuery('(min-width: 1280px)');

  const getActiveHeading = useCallback(() => {
    const isAtBottom =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 10;
    if (isAtBottom) {
      return headings[headings.length - 1];
    }

    const headingsInVisibleArea = headings.filter(heading => {
      const element = document.getElementById(heading.id);
      if (!element) return false;

      const rect = element.getBoundingClientRect();
      return rect.top >= 20 && rect.top <= window.innerHeight * 0.2;
    });

    if (headingsInVisibleArea.length > 0) {
      return headingsInVisibleArea[0];
    }

    const allHeadingsAbove = headings.filter(heading => {
      const element = document.getElementById(heading.id);
      return element && element.getBoundingClientRect().top < 20;
    });

    if (allHeadingsAbove.length > 0) {
      return allHeadingsAbove[allHeadingsAbove.length - 1];
    }
  }, [headings]);

  useEffect(() => {
    if (!isLargerThanXl) return;

    if (headings.length > 0) setActiveId(headings[0].id);

    const checkActiveHeading = () => {
      const activeHeading = getActiveHeading();
      if (activeHeading !== undefined) {
        setActiveId(activeHeading.id);
      }
    };

    checkActiveHeading();

    const throttledCheck = () => throttle(checkActiveHeading, 100);
    window.addEventListener('scroll', throttledCheck);

    return () => {
      window.removeEventListener('scroll', throttledCheck);
    };
  }, [isLargerThanXl, headings, getActiveHeading, throttle]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <div
      className={clsx(
        'p-4 border border-gray-200',
        'w-full xl:fixed xl:right-8 xl:top-1/2 xl:transform xl:-translate-y-1/2 xl:w-64'
      )}
    >
      <ul className='space-y-2'>
        {headings.map(heading => (
          <li key={heading.id}>
            <button
              onClick={() => handleClick(heading.id)}
              className={clsx(
                'w-full text-left text-sm hover:text-blue-500 truncate text-gray-900',
                activeId === heading.id
                  ? 'xl:text-blue-500'
                  : 'xl:text-gray-500',
                heading.level == 1 ? '' : heading.level == 2 ? 'ml-2' : 'ml-4'
              )}
            >
              {heading.text}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
