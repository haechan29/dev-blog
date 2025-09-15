'use client';

import { toProps } from '@/features/post/domain/model/postToolbar';
import { setType } from '@/lib/redux/postToolbarSlice';
import { AppDispatch, RootState } from '@/lib/redux/store';
import clsx from 'clsx';
import { ChevronDown, ChevronRight, Menu } from 'lucide-react';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function PostToolbar() {
  return (
    <div className='block xl:hidden mb-4'>
      <div className='fixed top-0 left-0 right-0 backdrop-blur-md bg-white/80'>
        <div className='flex items-start pt-1 pb-4'>
          <button className='flex px-2 pt-4 items-center justify-center'>
            <Menu className='w-6 h-6' />
          </button>
          <ContentItem className='flex flex-1 items-start' />
        </div>
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
            'flex flex-col transition-opacity duration-300 ease-in-out',
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
          {(postToolbarProps.type === 'collapsed' ||
            postToolbarProps.type === 'expanded') && (
            <div
              className={clsx(
                'flex flex-col transition-discrete duration-300 ease-in',
                postToolbarProps.type === 'expanded' ? 'max-h-96' : 'max-h-0'
              )}
            >
              {postToolbar.headings.map(heading => (
                <div key={heading.id} className='truncate'>
                  {heading.text.repeat(100)}
                </div>
              ))}
            </div>
          )}
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
        className='flex px-2 pt-4 items-center justify-center'
      >
        <ChevronDown
          className={clsx(
            'w-6 h-6 transition-opacity|transform duration-300 ease-in-out',
            postToolbarProps.type === 'collapsed' ||
              postToolbarProps.type === 'expanded'
              ? 'opacity-100'
              : 'opacity-0',
            postToolbarProps.type === 'expanded' && '-rotate-180'
          )}
        />
      </button>
    </div>
  );
}
