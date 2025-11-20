'use client';

import SidebarButton from '@/components/post/sidebarButton';
import Heading from '@/features/post/domain/model/heading';
import usePostToolbar from '@/features/post/hooks/usePostToolbar';
import { PostToolbarProps } from '@/features/post/ui/postToolbarProps';
import useThrottle from '@/hooks/useThrottle';
import { setCurrentHeading } from '@/lib/redux/post/postReaderSlice';
import {
  setIsExpanded,
  setIsScrollingDown,
} from '@/lib/redux/post/postToolbarSlice';
import { AppDispatch } from '@/lib/redux/store';
import { scrollIntoElement } from '@/lib/scroll';
import { cn } from '@/lib/utils';
import clsx from 'clsx';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useDispatch } from 'react-redux';

export default function PostToolbar({ className }: { className?: string }) {
  const dispatch = useDispatch<AppDispatch>();
  const postToolbar = usePostToolbar();
  const lastScrollYRef = useRef(0);
  const throttle = useThrottle();

  const breadcrumb = useMemo(() => {
    return postToolbar.mode === 'basic' ||
      postToolbar.mode === 'collapsed' ||
      postToolbar.mode === 'expanded'
      ? postToolbar.breadcrumb
      : [];
  }, [postToolbar]);

  const onContentClick = useCallback(
    (heading: Heading) => {
      if (postToolbar.mode === 'collapsed') {
        dispatch(setIsExpanded(true));
      }
      if (postToolbar.mode === 'expanded') {
        const postContent = document.querySelector('[data-post-content]');
        const element = postContent?.querySelector(`#${heading.id}`);
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

  return (
    <div
      className={cn(
        'fixed top-0 z-40 w-full flex flex-col p-2 bg-white/80 backdrop-blur-md',
        'xl:ml-[var(--sidebar-width)] block xl:hidden',
        'transition-transform duration-300 ease-in-out',
        postToolbar.isVisible ? 'translate-y-0' : '-translate-y-full',
        className
      )}
    >
      <Breadcrumb breadcrumb={breadcrumb} />

      <div className='flex w-full items-start'>
        <SidebarButton />
        <Content postToolbar={postToolbar} onClick={onContentClick} />
        <ExpandButton mode={postToolbar.mode} onClick={onExpandButtonClick} />
      </div>
    </div>
  );
}

function Breadcrumb({ breadcrumb }: { breadcrumb: string[] }) {
  return (
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
                  'pl-[var(--padding-left)]'
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
      className='shrink-0 px-2 items-center justify-center'
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
