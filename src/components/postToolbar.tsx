'use client';

import { toProps } from '@/features/post/domain/model/postToolbar';
import { RootState } from '@/lib/redux/store';
import clsx from 'clsx';
import { ChevronRight, Menu } from 'lucide-react';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

export default function PostToolbar({ className }: { className?: string }) {
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
        <ContentItem />
      </div>
    </div>
  );
}

function ContentItem() {
  const postToolbar = useSelector((state: RootState) => state.postToolbar);
  const postToolbarProps = useMemo(() => toProps(postToolbar), [postToolbar]);

  return (
    <div
      className={clsx(
        'flex flex-1 overflow-hidden transition-opacity duration-300 ease-in-out',
        postToolbarProps.type === 'empty' ? 'opacity-0' : 'opacity-100'
      )}
    >
      <div className='flex flex-col'>
        <div className='flex text-xs h-4 text-gray-400'>
          {(postToolbarProps.type === 'basic' ||
            postToolbarProps.type === 'collapsed' ||
            postToolbarProps.type === 'expanded') &&
            postToolbarProps.breadcrumb.map(item => {
              return (
                <div key={item} className='flex items-center'>
                  <div>{item}</div>
                  <ChevronRight className='w-3 h-3' />
                </div>
              );
            })}
        </div>
        <div className='font-semibold h-6 truncate'>
          {postToolbarProps.type !== 'empty' && postToolbarProps.title}
        </div>
      </div>
    </div>
  );
}
