'use client';

import Heading from '@/features/post/domain/model/heading';
import usePostToolbar from '@/features/post/hooks/usePostToolbar';
import { PostToolbarProps } from '@/features/post/ui/postToolbarProps';
import useThrottle from '@/hooks/useThrottle';
import { setCurrentHeading } from '@/lib/redux/post/postReaderSlice';
import { setIsVisible } from '@/lib/redux/post/postSidebarSlice';
import {
  setIsExpanded,
  setIsScrollingDown,
} from '@/lib/redux/post/postToolbarSlice';
import { AppDispatch } from '@/lib/redux/store';
import { scrollIntoElement } from '@/lib/scroll';
import { cn } from '@/lib/utils';
import clsx from 'clsx';
import { ChevronDown, Menu } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

export default function PostToolbar({ className }: { className?: string }) {
  const dispatch = useDispatch<AppDispatch>();
  const postToolbar = usePostToolbar();
  const lastScrollYRef = useRef(0);
  const throttle = useThrottle();
  const [isMounted, setIsMounted] = useState(false);

  const onContentClick = useCallback(
    (heading: Heading) => {
      if (postToolbar.mode === 'collapsed') {
        dispatch(setIsExpanded(true));
      }
      if (postToolbar.mode === 'expanded') {
        const postContent = document.querySelector('[data-post-content]');
        const element = postContent?.querySelector(`[id="${heading.id}"]`);
        if (element) {
          scrollIntoElement(
            element,
            {
              behavior: 'smooth',
              block: 'start',
            },
            () => {
              dispatch(setCurrentHeading(heading));
              dispatch(setIsExpanded(false));
            }
          );
        }
      }
    },
    [dispatch, postToolbar.mode]
  );

  const onExpandButtonClick = useCallback(() => {
    dispatch(setIsExpanded(postToolbar.mode !== 'expanded'));
  }, [dispatch, postToolbar.mode]);

  useEffect(() => {
    const handleScroll = () => {
      throttle(() => {
        const currentScrollY = window.scrollY;
        const lastScrollY = lastScrollYRef.current;
        dispatch(setIsScrollingDown(currentScrollY > lastScrollY));
        lastScrollYRef.current = currentScrollY;

        dispatch(setIsExpanded(false));
      }, 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [dispatch, postToolbar.mode, throttle]);

  useEffect(() => setIsMounted(true), []);

  return (
    isMounted && (
      <div
        className={cn(
          'fixed top-0 z-40 w-full flex flex-col bg-white/80 backdrop-blur-md',
          'py-2 md:py-3 px-4 md:px-4',
          'xl:ml-(--sidebar-width) block xl:hidden',
          'transition-transform duration-300 ease-in-out',
          postToolbar.isVisible ? 'translate-y-0' : '-translate-y-full',
          className
        )}
      >
        {!!postToolbar.breadcrumb && (
          <div className='h-3 flex items-center mx-8 text-xs text-gray-400 transition-discrete duration-300 ease-in-out'>
            {postToolbar.breadcrumb}
          </div>
        )}

        <div className='flex gap-2 md:gap-3 w-full items-start'>
          <button
            onClick={() => {
              dispatch(setIsVisible(true));
            }}
            className='xl:hidden shrink-0 p-2 -m-2 items-center justify-center'
          >
            <Menu className='w-6 h-6 text-gray-500' />
          </button>
          <Content postToolbar={postToolbar} onClick={onContentClick} />
          <ExpandButton mode={postToolbar.mode} onClick={onExpandButtonClick} />
        </div>
      </div>
    )
  );
}

function Content({
  postToolbar,
  onClick,
}: {
  postToolbar: PostToolbarProps;
  onClick: (heading: Heading) => void;
}) {
  return (
    <div className='flex flex-1 min-w-0 max-h-60 overflow-auto scrollbar-hide'>
      <div
        className={clsx(
          'flex flex-col w-full transition-opacity duration-300 ease-in-out',
          postToolbar.mode === 'empty' ? 'opacity-0' : 'opacity-100'
        )}
      >
        {postToolbar.mode === 'basic' && (
          <div className='font-semibold h-6 truncate'>{postToolbar.title}</div>
        )}
        {(postToolbar.mode === 'collapsed' ||
          postToolbar.mode === 'expanded') && (
          <div className='flex flex-col'>
            {postToolbar.headings.map(heading => (
              <button
                key={heading.id}
                onClick={() => onClick(heading)}
                className={clsx(
                  'truncate text-left transition-discrete|opacity duration-300 ease-in',
                  postToolbar.mode === 'expanded' ||
                    postToolbar.title === heading.text
                    ? 'h-6 opacity-100'
                    : 'h-0 opacity-0',
                  postToolbar.title === heading.text
                    ? 'text-gray-900 font-semibold'
                    : 'text-gray-400',
                  postToolbar.mode === 'expanded' && 'my-1 md:my-2',
                  'pl-(--padding-left)'
                )}
                style={{
                  '--padding-left':
                    postToolbar.mode === 'expanded'
                      ? `${heading.level - 1}rem`
                      : '0px',
                }}
              >
                {heading.text}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ExpandButton({
  mode,
  onClick,
}: {
  mode: PostToolbarProps['mode'];
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className='shrink-0 p-2 -m-2 items-center justify-center'
    >
      <ChevronDown
        className={clsx(
          'w-6 h-6 text-gray-500 transition-opacity|transform duration-300 ease-in-out',
          mode === 'collapsed' || mode === 'expanded'
            ? 'opacity-100'
            : 'opacity-0',
          mode === 'expanded' && '-rotate-180'
        )}
      />
    </button>
  );
}
