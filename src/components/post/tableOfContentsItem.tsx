'use client';

import Heading from '@/features/post/domain/model/heading';
import useViewerToolbar from '@/features/postViewer/hooks/useViewerToolbar';
import { setCurrentHeading } from '@/lib/redux/postPositionSlice';
import { AppDispatch } from '@/lib/redux/store';
import { scrollToElement } from '@/lib/scroll';
import clsx from 'clsx';
import { useDispatch } from 'react-redux';

export default function TableOfContentsItem({
  headings,
}: {
  headings: Heading[];
}) {
  const dispatch = useDispatch<AppDispatch>();
  const { currentHeading } = useViewerToolbar();

  const handleClick = (heading: Heading) => {
    const element = document.getElementById(heading.id);
    if (element) {
      scrollToElement(
        element,
        {
          behavior: 'smooth',
          block: 'start',
        },
        () => dispatch(setCurrentHeading(heading))
      );
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
              onClick={() => handleClick(heading)}
              className={clsx(
                'w-full text-left text-sm hover:text-blue-500 truncate text-gray-900',
                currentHeading?.id === heading.id
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
