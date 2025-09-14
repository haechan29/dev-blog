'use client';

import { RootState } from '@/lib/redux/store';
import clsx from 'clsx';
import { ChevronRight, Menu } from 'lucide-react';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

export default function PostToolbar({ className }: { className?: string }) {
  const breadcrumb = useSelector(
    (state: RootState) => state.postToolbar.breadcrumb
  );
  const headings = useSelector(
    (state: RootState) => state.postToolbar.headings
  );
  const isContentVisible = useSelector(
    (state: RootState) => state.postToolbar.isContentVisible
  );

  const title = useMemo(() => {
    const titles = headings
      .filter(heading => heading.isSelected)
      .map(heading => heading.text);
    return titles.length > 0 ? titles[0] : null;
  }, [headings]);

  return (
    <div className={className}>
      <div
        className={
          'fixed top-0 left-0 right-0 pt-1 pb-4 pr-10 backdrop-blur-md bg-white/80 flex items-center'
        }
      >
        <button className='flex px-2 place-self-end items-center justify-center'>
          <Menu className='w-6 h-6' />
        </button>
        <div className='flex flex-1 overflow-hidden flex-col'>
          <div className='flex text-xs text-gray-400'>
            {breadcrumb.map(item => {
              return (
                <div key={item} className='flex items-center'>
                  <div>{item}</div>
                  <ChevronRight className='w-3 h-3' />
                </div>
              );
            })}
          </div>
          <div
            className={clsx(
              'font-semibold truncate',
              title !== null && isContentVisible ? 'opacity-100' : 'opacity-0'
            )}
          >
            {title ?? ''}
          </div>
        </div>
      </div>
    </div>
  );
}
