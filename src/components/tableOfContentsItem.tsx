"use client";

import { Heading } from '@/features/post/domain/post';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

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
    
    window.addEventListener('scroll', checkActiveHeading);
    
    return () => {
      window.removeEventListener('scroll', checkActiveHeading);
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
    <>
      <div className="fixed inset-0 pointer-events-none z-40">
          <div 
            className="absolute left-0 right-0 bg-red-200/70 border-2 border-red-500"
            style={{
              top: '20px',        // rootMargin -20px
              height: 'calc(20% - 20px)'       // 100% - 80% = 20%
            }}
          >
            <div className="text-red-500 text-xs p-1">교차 감지 영역</div>
          </div>
        </div>

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
    </>
  );
}