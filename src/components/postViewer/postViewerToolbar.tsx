'use client';

import { Heading } from '@/features/post/domain/model/post';
import { toProps } from '@/features/postViewer/domain/model/postViewer';
import {
  getHeadingByPage,
  getPageByHeading,
} from '@/features/postViewer/domain/types/headingPageMapping';
import { setPageIndex } from '@/lib/redux/postViewerSlice';
import { AppDispatch, RootState } from '@/lib/redux/store';
import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function PostViewerHeader({
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

    const pageIndex = getPageByHeading(headingPageMapping, heading.id);
    if (pageIndex === undefined) return;

    dispatch(setPageIndex(pageIndex));
    setIsExpanded(false);
  };

  const headingText = useMemo(() => {
    if (pageNumber === null || !headingPageMapping) return null;

    const headingId = getHeadingByPage(headingPageMapping, pageNumber - 1);
    const heading = headings.find(heading => heading.id === headingId);
    return heading?.text ?? null;
  }, [headingPageMapping, headings, pageNumber]);

  return (
    <div
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 flex flex-col min-w-0',
        'px-10 py-3 backdrop-blur-md bg-white/80'
      )}
    >
      {headingText !== null && (
        <div className={clsx('w-full text-ellipsis text-xs text-gray-400')}>
          {title}
        </div>
      )}

      <div className='flex w-full min-w-0 items-start'>
        <div className='flex flex-1 min-w-0'>
          <div className='flex flex-col w-full transition-opacity duration-300 ease-in-out'>
            <div className='font-semibold h-6 truncate'>
              {headingText ?? title}
            </div>

            <div className='flex flex-col'>
              {headings.map(heading => (
                <button
                  key={heading.id}
                  onClick={() => handleClick(heading)}
                  className={clsx(
                    'flex truncate transition-discrete|opacity duration-300 ease-in',
                    isExpanded || title === heading.text
                      ? 'h-6 opacity-100'
                      : 'h-0 opacity-0',
                    title === heading.text
                      ? 'text-gray-900 font-semibold'
                      : 'text-gray-400',
                    isExpanded && 'my-0.5'
                  )}
                >
                  {heading.text}
                </button>
              ))}
            </div>
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
