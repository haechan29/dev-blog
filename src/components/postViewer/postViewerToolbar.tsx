'use client';

import { Heading } from '@/features/post/domain/model/post';
import { toProps } from '@/features/postViewer/domain/model/postViewer';
import useHeading from '@/features/postViewer/hooks/useHeading';
import { RootState } from '@/lib/redux/store';
import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

export default function PostViewerToolbar({
  title,
  headings,
}: {
  title: string;
  headings: Heading[];
}) {
  const postViewer = useSelector((state: RootState) => state.postViewer);
  const { areBarsVisible } = useMemo(() => toProps(postViewer), [postViewer]);
  // 이 값도 나중엔 rtk로 옮기자.
  const [isExpanded, setIsExpanded] = useState(false);
  const [heading, setHeading] = useHeading();

  const handleClick = useCallback(
    (heading: Heading) => {
      if (isExpanded) setHeading(heading);
      setIsExpanded(prev => !prev);
    },
    [isExpanded, setHeading]
  );

  return (
    <div
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 flex flex-col backdrop-blur-md bg-white/80 px-10 py-3',
        'transition-opacity duration-300 ease-in-out',
        !areBarsVisible && 'opacity-0'
      )}
    >
      {heading !== null && (
        <div className={clsx('w-full truncate text-gray-400')}>{title}</div>
      )}

      <div className='flex w-full items-start'>
        <div className='flex flex-1 min-w-0'>
          <div className='flex flex-col w-full'>
            {headings.map(item => (
              <button
                key={item.id}
                onClick={() => handleClick(item)}
                className={clsx(
                  'flex w-full text-xl transition-discrete|opacity duration-300 ease-in',
                  isExpanded || heading?.id === item.id
                    ? 'h-6 opacity-100'
                    : 'h-0 opacity-0',
                  heading?.id === item.id
                    ? 'text-gray-900 font-bold'
                    : 'text-gray-400',
                  isExpanded && 'my-2',
                  isExpanded && item.level == 2 && 'pl-4',
                  isExpanded && item.level == 3 && 'pl-8'
                )}
              >
                <span className='truncate'>{item.text}</span>
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
