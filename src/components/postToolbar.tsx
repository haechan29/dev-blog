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
          <button className='flex shrink-0 px-2 pt-4 items-center justify-center'>
            <Menu className='w-6 h-6' />
          </button>
          <ContentItem />
        </div>
      </div>
    </div>
  );
}

function ContentItem() {
  const postToolbar = useSelector((state: RootState) => state.postToolbar);
  const postToolbarProps = useMemo(() => toProps(postToolbar), [postToolbar]);

  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className='flex flex-1 min-w-0 items-start'>
      <div className='flex flex-1 min-w-0'>
        <div
          className={clsx(
            'flex flex-col w-full transition-opacity duration-300 ease-in-out',
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
          {(postToolbarProps.type === 'collapsed' ||
            postToolbarProps.type === 'expanded') && (
            <div className='flex flex-col'>
              {postToolbarProps.headings.map(heading => (
                <div
                  key={heading.id}
                  className={clsx(
                    'truncate transition-discrete|opacity duration-300 ease-in',
                    postToolbarProps.type === 'expanded' ||
                      postToolbarProps.title === heading.text
                      ? 'h-7 opacity-100'
                      : 'h-0 opacity-0',
                    postToolbarProps.title === heading.text
                      ? 'text-gray-900 font-semibold '
                      : 'text-gray-400',
                    postToolbarProps.type === 'expanded' && 'py-0.5'
                  )}
                >
                  {heading.text}
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
        className='flex shrink-0 px-2 pt-4 items-center justify-center'
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
