'use client';

import Heading from '@/features/post/domain/model/heading';
import { setCurrentHeading } from '@/lib/redux/post/postReaderSlice';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { scrollIntoElement } from '@/lib/scroll';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';

export default function TableOfContentsItem({
  headings,
}: {
  headings: Heading[];
}) {
  const dispatch = useDispatch<AppDispatch>();
  const { currentHeading } = useSelector(
    (state: RootState) => state.postReader
  );

  const handleClick = (heading: Heading) => {
    const postContent = document.querySelector('[data-post-content]');
    const element = postContent?.querySelector(`#${heading.id}`);
    if (element) {
      scrollIntoElement(
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
        'w-full  xl:w-(--toc-width) p-4 xl:m-(--toc-margin) border border-gray-200',
        'xl:fixed xl:right-0 xl:top-1/2 xl:transform xl:-translate-y-1/2'
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
