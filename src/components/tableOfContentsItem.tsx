"use client";

import { Heading } from '@/features/post/domain/post';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { throttle } from 'lodash';

export default function TableOfContents({ headings }: { headings: Heading[]; }) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (headings.length > 0) setActiveId(headings[0].id);
    
    const checkActiveHeading = () => {
      const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 10;      
      if (isAtBottom) {
        setActiveId(headings[headings.length - 1].id);
        return;
      }

      const headingsInVisibleArea = headings.filter(heading => {
        const element = document.getElementById(heading.id);
        if (!element) return false;
        
        const rect = element.getBoundingClientRect();
        return rect.top >= 20 && rect.top <= window.innerHeight * 0.2;
      }).sort((a, b) => {
        const aElement = document.getElementById(a.id);
        const bElement = document.getElementById(b.id);
        return aElement!.getBoundingClientRect().top - bElement!.getBoundingClientRect().top;
      });

      if (headingsInVisibleArea.length > 0) {
        setActiveId(headingsInVisibleArea[0].id);
        return;
      }

      const allHeadingsAbove = headings.filter(heading => {
        const element = document.getElementById(heading.id);
        return element && element.getBoundingClientRect().top < 20;
      });

      if (allHeadingsAbove.length > 0) {
        setActiveId(allHeadingsAbove[allHeadingsAbove.length - 1].id);
      }
    };

    checkActiveHeading();

    const throttledCheck = throttle(checkActiveHeading, 100);
    window.addEventListener('scroll', throttledCheck);
    
    return () => {
      window.removeEventListener('scroll', throttledCheck);
    };
  }, [headings]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div className='hidden xl:block fixed right-8 top-1/2 transform -translate-y-1/2 w-64 p-4 border border-gray-200'>
      <ul className="space-y-2">
        {headings.map((heading) => (
          <li key={heading.id}>
            <button
              onClick={() => handleClick(heading.id)}
              className={clsx(
                'text-sm hover:text-blue-500 truncate',
                activeId === heading.id ? 'text-blue-500' : 'text-gray-500',
                heading.level >= 4 ? `ml-${(heading.level - 3) * 2}`: ''
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