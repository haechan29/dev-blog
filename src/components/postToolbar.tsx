'use client';

import { toProps } from '@/features/post/domain/model/postToolbar';
import { setType } from '@/lib/redux/postToolbarSlice';
import { AppDispatch, RootState } from '@/lib/redux/store';
import clsx from 'clsx';
import { ChevronDown, ChevronRight, Menu } from 'lucide-react';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function PostToolbar({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className='fixed top-0 left-0 right-0 pt-1 pb-4 backdrop-blur-md bg-white/80 flex items-end'>
        <button className='flex px-2 items-center justify-center'>
          <Menu className='w-6 h-6' />
        </button>
        <ContentItem className='flex flex-1 items-end' />
      </div>
    </div>
  );
}

function ContentItem({ className }: { className?: string }) {
  const postToolbar = useSelector((state: RootState) => state.postToolbar);
  const postToolbarProps = useMemo(() => toProps(postToolbar), [postToolbar]);

  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className={className}>
      <div className='flex flex-1'>
        <div
          className={clsx(
            'flex flex-col overflow-hidden transition-opacity duration-300 ease-in-out',
            postToolbarProps.type === 'empty' ? 'opacity-0' : 'opacity-100'
          )}
        >
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
      <button
        onClick={() =>
          dispatch(
            setType(
              postToolbarProps.type === 'expanded' ? 'collapsed' : 'expanded'
            )
          )
        }
        className={clsx(
          'flex px-2 items-center justify-center transition-opacity|transform duration-300 ease-in-out',
          postToolbarProps.type === 'collapsed' ||
            postToolbarProps.type === 'expanded'
            ? 'opacity-100'
            : 'opacity-0',
          postToolbarProps.type === 'expanded' && '-rotate-180'
        )}
      >
        <ChevronDown className='w-6 h-6' />
      </button>
    </div>
  );
}
