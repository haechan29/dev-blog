"use client";

import { Heading } from '@/features/post/domain/post';
import clsx from 'clsx';

export default function TableOfContents({ headings }: { headings: Heading[]; }) {
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
        {headings.map((heading, idx) => (
          <li key={`${heading.id}-${idx}`}>
            <button
              onClick={() => handleClick(heading.id)}
              className={clsx(
                'text-sm text-gray-500 hover:text-blue-500 truncate', 
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