'use client';

import { Heading } from '@/features/post/domain/model/post';
import useMediaQuery from '@/hooks/useMediaQuery';
import useThrottle from '@/hooks/useThrottle';
import clsx from 'clsx';
import { ChevronRight, Menu } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export default function PostToolbar({
  title,
  headings,
  isHeaderVisible,
}: {
  title: string;
  headings: Heading[];
  isHeaderVisible: boolean;
}) {
  const [activeHeading, setActiveHeading] = useState<Heading | null>(null);
  const [isInProseSection, setIsInProseSection] = useState(false);

  const [throttle100Ms] = useThrottle(100);
  const isLargerThanXl = useMediaQuery('(min-width: 1280px)');

  const searchParams = useSearchParams();
  const selectedTag = searchParams.get('tag');

  const getActiveHeading = useCallback(() => {
    const headingsInVisibleArea = headings.filter(heading => {
      const element = document.getElementById(heading.id);
      if (!element) return false;

      const rect = element.getBoundingClientRect();
      return rect.top >= 10 && rect.top <= 20;
    });

    if (headingsInVisibleArea.length > 0) {
      return headingsInVisibleArea[0];
    }

    const allHeadingsAbove = headings.filter(heading => {
      const element = document.getElementById(heading.id);
      return element && element.getBoundingClientRect().top < 10;
    });

    if (allHeadingsAbove.length > 0) {
      return allHeadingsAbove[allHeadingsAbove.length - 1];
    }

    return null;
  }, [headings]);

  useEffect(() => {
    const proseElement = document.querySelector('.prose');
    if (!proseElement) return;

    const proseObserver = new IntersectionObserver(
      entries => setIsInProseSection(entries[0].isIntersecting),
      {
        rootMargin: '-20px 0px -100% 0px',
      }
    );
    proseObserver.observe(proseElement);
    return () => proseObserver.disconnect();
  }, []);

  useEffect(() => {
    if (isLargerThanXl) return;

    const checkActiveHeading = () => setActiveHeading(getActiveHeading());
    checkActiveHeading();
    const throttledCheck = () => throttle100Ms(checkActiveHeading);
    window.addEventListener('scroll', throttledCheck);

    return () => {
      window.removeEventListener('scroll', throttledCheck);
    };
  }, [isLargerThanXl, headings]);

  return (
    <div
      className={
        'fixed top-0 left-0 right-0 pt-1 pb-4 pr-10 backdrop-blur-md bg-white/80 flex items-center'
      }
    >
      <button className='flex px-2 place-self-end items-center justify-center'>
        <Menu className='w-6 h-6' />
      </button>
      <div
        className={clsx(
          'flex flex-1 overflow-hidden flex-col transition-opacity duration-300 ease-in-out',
          isHeaderVisible ? 'opacity-0' : 'opacity-100'
        )}
      >
        <div className='flex items-center text-xs text-gray-400'>
          {selectedTag !== null && (
            <>
              <div>{selectedTag}</div>
              <ChevronRight className='w-3 h-3' />
            </>
          )}
          <div
            className={clsx(
              'flex items-center transition-opacity duration-300 ease-in-out',
              isInProseSection ? 'opacity-100' : 'opacity-0'
            )}
          >
            <div>{title}</div>
            <ChevronRight className='w-3 h-3' />
          </div>
        </div>
        <div className='font-semibold truncate'>
          {activeHeading !== null && isInProseSection
            ? activeHeading.text
            : title}
        </div>
      </div>
    </div>
  );
}
