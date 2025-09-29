'use client';

import { Heading } from '@/features/post/domain/model/post';
import { toProps } from '@/features/postViewer/domain/model/postViewer';
import {
  getHeadingsByPage,
  getPageByHeadingId,
} from '@/features/postViewer/domain/types/headingPageMapping';
import { setPageIndex } from '@/lib/redux/postViewerSlice';
import { AppDispatch, RootState } from '@/lib/redux/store';
import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function PostViewerToolbar({
  title,
  headings,
}: {
  title: string;
  headings: Heading[];
}) {
  const dispatch = useDispatch<AppDispatch>();
  const postViewer = useSelector((state: RootState) => state.postViewer);
  const { pageNumber, headingPageMapping } = useMemo(
    () => toProps(postViewer),
    [postViewer]
  );
  // 이 값도 나중엔 rtk로 옮기자.
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = (heading: Heading) => {
    if (!isExpanded || !headingPageMapping) return;

    const pageIndex = getPageByHeadingId(headingPageMapping, heading.id);
    if (pageIndex === undefined) return;

    dispatch(setPageIndex(pageIndex));
    setIsExpanded(false);
  };

  const currentHeading = useMemo(() => {
    if (pageNumber === null || !headingPageMapping) return null;

    const headings = getHeadingsByPage(headingPageMapping, pageNumber - 1);
    if (!headings || headings.length === 0) return null;
    return headings[0];
  }, [headingPageMapping, pageNumber]);

  return (
    <div
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 flex flex-col',
        'px-10 py-3 backdrop-blur-md bg-white/80'
      )}
    >
      {currentHeading !== null && (
        <div className={clsx('w-full truncate text-gray-400')}>{title}</div>
      )}

      <div className='flex w-full items-start'>
        <div className='flex flex-1 min-w-0'>
          <div className='flex flex-col min-w-0'>
            {headings.map(heading => (
              <button
                key={heading.id}
                onClick={() => handleClick(heading)}
                className={clsx(
                  'flex truncate text-xl transition-discrete|opacity duration-300 ease-in',
                  isExpanded || currentHeading?.id === heading.id
                    ? 'h-6 opacity-100'
                    : 'h-0 opacity-0',
                  currentHeading?.id === heading.id
                    ? 'text-gray-900 font-bold'
                    : 'text-gray-400',
                  isExpanded && 'my-2',
                  isExpanded && heading.level == 2 && 'ml-4',
                  isExpanded && heading.level == 3 && 'ml-8'
                )}
              >
                <span className='truncate'>{heading.text}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(prev => !prev)}
          className='flex shrink-0 px-2 items-center justify-center'
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
