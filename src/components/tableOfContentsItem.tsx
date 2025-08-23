"use client";

import { Heading } from '@/features/post/domain/post';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

export default function TableOfContents({ headings }: { headings: Heading[]; }) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (headings.length > 0) setActiveId(headings[0].id);
    
    const observer = new IntersectionObserver(
      entries => {        
        const visibleHeadings = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visibleHeadings.length > 0) {
          return setActiveId(visibleHeadings[0].target.id);
        }

        const allHeadingsAbove = headings.filter(heading => {
          const element = document.getElementById(heading.id);
          return element && element.getBoundingClientRect().top < 40;
        });

        if (allHeadingsAbove.length > 0) {
          setActiveId(allHeadingsAbove[allHeadingsAbove.length - 1].id);
        }
      },
      {
        rootMargin: '-20px 0px -80% 0px',
        threshold: 0
      }
    );

    headings.forEach(heading => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
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