'use client';

import { Heading } from '@/features/post/domain/model/post';
import { toProps } from '@/features/post/domain/model/postToolbar';
import { setIsVisible } from '@/lib/redux/postSidebarSlice';
import { setIsExpanded } from '@/lib/redux/postToolbarSlice';
import { AppDispatch, RootState } from '@/lib/redux/store';
import clsx from 'clsx';
import { ChevronDown, ChevronRight, Menu } from 'lucide-react';
import { useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function PostToolbar() {
  const dispatch = useDispatch<AppDispatch>();
  const postToolbar = useSelector((state: RootState) => state.postToolbar);
  const postToolbarProps = useMemo(() => toProps(postToolbar), [postToolbar]);

  const breadcrumb = useMemo(() => {
    return postToolbarProps.mode === 'basic' ||
      postToolbarProps.mode === 'collapsed' ||
      postToolbarProps.mode === 'expanded'
      ? postToolbarProps.breadcrumb
      : [];
  }, [postToolbarProps]);

  const clickedHeading = useRef<Heading | null>(null);

  const handleClick = (heading: Heading) => {
    if (postToolbarProps.mode === 'collapsed') {
      dispatch(setIsExpanded(true));
    }
    if (postToolbarProps.mode === 'expanded') {
      const element = document.getElementById(heading.id);
      if (element) {
        clickedHeading.current = heading;
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }
  };

  useEffect(() => {
    if (
      postToolbarProps.mode === 'expanded' &&
      clickedHeading.current?.text === postToolbarProps.title
    ) {
      const timer = setTimeout(() => {
        dispatch(setIsExpanded(false));
        clickedHeading.current = null;
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [postToolbarProps, clickedHeading, dispatch]);

  return (
    <div className='block xl:hidden mb-4'>
      <div className='fixed top-0 left-0 right-0 backdrop-blur-md bg-white/80'>
        <div className='flex flex-col w-full min-w-0 py-2'>
          <div
            className={clsx(
              'flex overflow-y-hidden mx-10 text-xs text-gray-400 transition-discrete duration-300 ease-in-out',
              breadcrumb.length === 0 ? 'h-0' : 'h-3'
            )}
          >
            {breadcrumb.map(item => {
              return (
                <div key={item} className='flex items-center'>
                  <div>{item}</div>
                  <ChevronRight className='w-3 h-3' />
                </div>
              );
            })}
          </div>

          <div className='flex w-full min-w-0 items-start'>
            <button
              onClick={() => dispatch(setIsVisible(true))}
              className='flex shrink-0 px-2 items-center justify-center'
            >
              <Menu className='w-6 h-6 text-gray-500' />
            </button>
            <div className='flex flex-1 min-w-0'>
              <div
                className={clsx(
                  'flex flex-col w-full transition-opacity duration-300 ease-in-out',
                  postToolbarProps.mode === 'empty'
                    ? 'opacity-0'
                    : 'opacity-100'
                )}
              >
                {postToolbarProps.mode === 'basic' && (
                  <div className='font-semibold h-6 truncate'>
                    {postToolbarProps.title}
                  </div>
                )}
                {(postToolbarProps.mode === 'collapsed' ||
                  postToolbarProps.mode === 'expanded') && (
                  <div className='flex flex-col'>
                    {postToolbarProps.headings.map(heading => (
                      <button
                        key={heading.id}
                        onClick={() => handleClick(heading)}
                        className={clsx(
                          'flex truncate transition-discrete|opacity duration-300 ease-in',
                          postToolbarProps.mode === 'expanded' ||
                            postToolbarProps.title === heading.text
                            ? 'h-6 opacity-100'
                            : 'h-0 opacity-0',
                          postToolbarProps.title === heading.text
                            ? 'text-gray-900 font-semibold'
                            : 'text-gray-400',
                          postToolbarProps.mode === 'expanded' && 'my-0.5',
                          postToolbarProps.mode === 'expanded' &&
                            heading.level == 2
                            ? 'pl-4'
                            : heading.level == 3 && 'pl-8'
                        )}
                      >
                        {heading.text}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() =>
                dispatch(setIsExpanded(postToolbarProps.mode !== 'expanded'))
              }
              className='flex shrink-0 px-2 items-center justify-center'
            >
              <ChevronDown
                className={clsx(
                  'w-6 h-6 text-gray-500 transition-opacity|transform duration-300 ease-in-out',
                  postToolbarProps.mode === 'collapsed' ||
                    postToolbarProps.mode === 'expanded'
                    ? 'opacity-100'
                    : 'opacity-0',
                  postToolbarProps.mode === 'expanded' && '-rotate-180'
                )}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
