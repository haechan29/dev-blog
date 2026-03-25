'use client';

import Heading from '@/features/post/domain/types/heading';
import useThrottle from '@/hooks/useThrottle';
import { cn } from '@/lib/utils';
import clsx from 'clsx';
import { ChevronDown, Menu } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

export default function PostToolbar({
  title = '',
  headings = [],
  currentHeadingId = null,
  onHeadingClick = () => {},
  className,
  isHeaderVisible = false,
  onOpenSidebar = () => {},
}: {
  title?: string;
  headings?: Heading[];
  currentHeadingId?: string | null;
  onHeadingClick?: (heading: Heading) => void;
  className?: string;
  isHeaderVisible?: boolean;
  onOpenSidebar?: () => void;
}) {
  const throttle = useThrottle();
  const [isMounted, setIsMounted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const hasHeadings = headings.length > 0;

  const minLevel = useMemo(
    () => (headings.length > 0 ? Math.min(...headings.map(h => h.level)) : 1),
    [headings]
  );

  const onExpandButtonClick = useCallback(() => {
    if (!hasHeadings) return;
    setIsExpanded(prev => !prev);
  }, [hasHeadings]);

  useEffect(() => {
    const handleScroll = () => {
      throttle(() => {
        setIsExpanded(false);
      }, 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [throttle]);

  useEffect(() => setIsMounted(true), []);

  if (!isMounted || isHeaderVisible) {
    return null;
  }

  return (
    <div
      className={cn(
        'fixed top-0 z-40 w-full flex flex-col',
        'py-2 md:py-3 px-4 md:px-6 bg-white/80 backdrop-blur-md',
        'xl:ml-(--sidebar-width) block xl:hidden',
        'transition-transform duration-300 ease-in-out',
        className
      )}
    >
      <div className='flex gap-2 md:gap-3 w-full items-start'>
        <button
          onClick={onOpenSidebar}
          className='xl:hidden shrink-0 p-2 -m-2 items-center justify-center'
        >
          <Menu className='w-6 h-6 text-gray-500' />
        </button>

        <Content
          title={title}
          headings={headings}
          minLevel={minLevel}
          currentHeadingId={currentHeadingId}
          hasHeadings={hasHeadings}
          isExpanded={isExpanded}
          onClick={onHeadingClick}
        />

        {hasHeadings && (
          <button
            onClick={onExpandButtonClick}
            className='shrink-0 p-2 -m-2 items-center justify-center'
          >
            <ChevronDown
              className={clsx(
                'w-6 h-6 text-gray-500 transition-transform duration-300 ease-in-out',
                isExpanded && '-rotate-180'
              )}
            />
          </button>
        )}
      </div>
    </div>
  );
}

function Content({
  title,
  headings,
  minLevel,
  currentHeadingId,
  hasHeadings,
  isExpanded,
  onClick,
}: {
  title: string;
  headings: Heading[];
  minLevel: number;
  currentHeadingId: string | null;
  hasHeadings: boolean;
  isExpanded: boolean;
  onClick: (heading: Heading) => void;
}) {
  if (!hasHeadings || currentHeadingId === null) {
    return (
      <div className='flex flex-1 min-w-0 max-h-60 overflow-auto scrollbar-hide'>
        <div className='flex flex-col w-full'>
          <div className='font-semibold h-6 truncate'>{title}</div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-1 min-w-0 max-h-60 overflow-auto scrollbar-hide'>
      <div className='flex flex-col w-full'>
        <div className='flex flex-col'>
          {headings.map(heading => (
            <button
              key={heading.id}
              onClick={() => onClick(heading)}
              className={clsx(
                'truncate text-left transition duration-300 ease-in pl-(--indent)',
                isExpanded || heading.id === currentHeadingId
                  ? 'h-6 opacity-100'
                  : 'h-0 opacity-0',
                currentHeadingId === heading.id
                  ? 'text-gray-900 font-semibold'
                  : 'text-gray-400',
                isExpanded && 'my-1 md:my-2'
              )}
              style={{
                '--indent': `${(heading.level - minLevel) * 0.5}rem`,
              }}
            >
              {heading.textContent}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
