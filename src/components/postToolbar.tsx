'use client';

import { Heading } from '@/features/post/domain/model/post';
import useMediaQuery from '@/hooks/useMediaQuery';
import useThrottle from '@/hooks/useThrottle';
import { Menu } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

export default function PostToolbar({
  title,
  headings,
}: {
  title: string;
  headings: Heading[];
}) {
  const [activeHeading, setActiveHeading] = useState<Heading | null>(null);
  const [throttle100Ms] = useThrottle(100);
  const isLargerThanXl = useMediaQuery('(min-width: 1280px)');

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
        'fixed top-0 left-0 right-0 backdrop-blur-md bg-white/80 flex items-center border-b border-b-gray-200'
      }
    >
      <Menu className='w-10 h-10 p-2' />
    </div>
  );
}
