'use client';

import Heading from '@/features/post/domain/types/heading';
import useThrottle from '@/hooks/useThrottle';
import { cn } from '@/lib/utils';
import clsx from 'clsx';
import { ChevronDown, Menu } from 'lucide-react';
import { useEffect, useState } from 'react';

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
  const minLevel = hasHeadings ? Math.min(...headings.map(h => h.level)) : 1;
  const isTitleVisible =
    !isHeaderVisible && (!hasHeadings || currentHeadingId === null);
  const isExpandButtonVisible = !isHeaderVisible && !isTitleVisible;

  const isCurrentHeading = (heading: Heading) =>
    heading.id === currentHeadingId;
  const isCurrentHeadingVisible = (heading: Heading) =>
    !isHeaderVisible &&
    !isTitleVisible &&
    (isExpanded || isCurrentHeading(heading));

  const onExpandButtonClick = () => {
    if (!isExpandButtonVisible) return;
    setIsExpanded(prev => !prev);
  };

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

  if (!isMounted) {
    return null;
  }

  return (
    <div
      className={cn(
        'fixed top-0 z-40 w-full flex flex-col',
        'py-2 md:py-3 px-4 md:px-6 bg-white/80 backdrop-blur-md xl:ml-(--sidebar-width)',
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

        <div className='flex flex-1 min-w-0 max-h-60 overflow-auto scrollbar-hide'>
          <div className='flex flex-col'>
            <div className='flex flex-col'>
              <div
                className={clsx(
                  'font-semibold truncate duration-300 ease-in',
                  isTitleVisible ? 'h-6 opacity-100' : 'h-0 opacity-0'
                )}
              >
                {title}
              </div>
              {headings.map(heading => (
                <button
                  key={heading.id}
                  onClick={() => onHeadingClick(heading)}
                  className={clsx(
                    'truncate text-left duration-300 ease-in',
                    isCurrentHeadingVisible(heading)
                      ? 'h-6 opacity-100'
                      : 'h-0 opacity-0',
                    isCurrentHeading(heading)
                      ? 'text-gray-900 font-semibold'
                      : 'text-gray-400',
                    isExpanded && 'my-1 md:my-2 pl-(--indent)'
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

        <button
          onClick={onExpandButtonClick}
          className={clsx(
            'shrink-0 p-2 -m-2 items-center justify-center',
            'transition-opacity duration-300 ease-in-out',
            !isExpandButtonVisible && 'opacity-0'
          )}
        >
          <ChevronDown
            className={clsx(
              'w-6 h-6 text-gray-500 transition-transform duration-300 ease-in-out',
              isExpanded && '-rotate-180'
            )}
          />
        </button>
      </div>
    </div>
  );
}
