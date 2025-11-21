'use client';

import Heading from '@/features/post/domain/model/heading';
import usePostViewer from '@/features/postViewer/hooks/usePostViewer';
import useDebounce from '@/hooks/useDebounce';
import { canTouch } from '@/lib/browser';
import {
  setCurrentPageIndex,
  setIsMouseOnToolbar,
  setIsToolbarExpanded,
  setIsToolbarTouched,
} from '@/lib/redux/post/postViewerSlice';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { scrollIntoElement } from '@/lib/scroll';
import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function PostViewerToolbar({
  title,
  headings,
}: {
  title: string;
  headings: Heading[];
}) {
  const { areBarsVisible } = usePostViewer();
  const { page, isViewerMode } = usePostViewer();
  const pages = useSelector((state: RootState) => state.postViewer.pages);

  const dispatch = useDispatch<AppDispatch>();
  const debounce = useDebounce();
  const { isToolbarExpanded: isExpanded } = usePostViewer();

  const onMouseEnter = useCallback(() => {
    if (canTouch) return;
    dispatch(setIsMouseOnToolbar(true));
  }, [dispatch]);

  const onMouseLeave = useCallback(() => {
    if (canTouch) return;
    dispatch(setIsMouseOnToolbar(false));
  }, [dispatch]);

  const onContentClick = useCallback(
    (heading: Heading) => {
      if (isExpanded) {
        const pageIndex = pages.findIndex(page => {
          return page.heading && page.heading.id == heading.id;
        });
        if (pageIndex >= 0) {
          dispatch(setCurrentPageIndex(pageIndex));
        }
      }
      dispatch(setIsToolbarExpanded(!isExpanded));

      dispatch(setIsToolbarTouched(true));
      debounce(() => dispatch(setIsToolbarTouched(false)), 2000);
    },
    [debounce, dispatch, isExpanded, pages]
  );

  useEffect(() => {
    if (!isViewerMode || !page?.heading) return;

    const content = document.querySelector(
      `[data-heading-id='${page.heading.id}']`
    );
    if (!content) return;

    const scrollToContent = () => {
      scrollIntoElement(content, {
        behavior: 'smooth',
        block: 'nearest',
      });
    };
    content.addEventListener('transitionend', scrollToContent);
    return () => content.removeEventListener('transitionend', scrollToContent);
  }, [isViewerMode, page?.heading]);

  return (
    <div
      className={clsx(
        'absolute top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md',
        'max-md:pb-[var(--gradient-padding-bottom)] max-md:from-black/50 max-md:to-transparent max-md:bg-gradient-to-b',
        'transition-opacity|discrete duration-300 ease-in-out',
        !areBarsVisible && 'opacity-0 pointer-events-none'
      )}
      style={{
        '--gradient-padding-bottom': isExpanded ? '5rem' : '2.5rem',
      }}
      onClick={e => e.stopPropagation()}
    >
      <div
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className='flex flex-col p-2 md:p-4 lg:p-6'
      >
        <Title title={title} heading={page?.heading ?? null} />

        <div className='flex w-full items-start'>
          <Content
            isExpanded={isExpanded}
            heading={page?.heading ?? null}
            headings={headings}
            onContentClick={onContentClick}
          />

          <button
            onClick={() => {
              dispatch(setIsToolbarExpanded(!isExpanded));
            }}
            className='flex shrink-0 px-2 items-center justify-center cursor-pointer'
          >
            <ChevronDown
              className={clsx(
                'w-6 h-6 text-white md:text-gray-500 stroke-1 transition-transform duration-300 ease-in-out',
                isExpanded && '-rotate-180'
              )}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

function Title({ title, heading }: { title: string; heading: Heading | null }) {
  return (
    heading !== null && (
      <div className='w-full truncate hidden md:block md:text-sm lg:text-base text-gray-400 px-2'>
        {title}
      </div>
    )
  );
}

function Content({
  isExpanded,
  heading,
  headings,
  onContentClick,
}: {
  isExpanded: boolean;
  heading: Heading | null;
  headings: Heading[];
  onContentClick: (heading: Heading) => void;
}) {
  return (
    <div className='flex flex-1 min-w-0 px-2 max-h-40 md:max-h-60 lg:max-h-80 overflow-y-auto scrollbar-hide'>
      <div className='flex flex-col w-full'>
        {headings.map(item => (
          <button
            data-heading-id={item.id}
            key={item.id}
            onClick={() => onContentClick(item)}
            className={clsx(
              'w-full text-base md:text-lg lg:text-xl text-left text-white md:text-gray-900',
              'transition-discrete|opacity duration-300 ease-in',
              isExpanded || heading?.id === item.id
                ? 'h-6 opacity-100'
                : 'h-0 opacity-0',
              heading?.id === item.id
                ? 'text-gray-900 font-bold'
                : 'text-gray-400',
              isExpanded && 'my-1 md:my-2',
              'pl-[var(--padding-left)]'
            )}
            style={{
              '--padding-left': isExpanded ? `${item.level - 1}rem` : '0px',
            }}
          >
            {item.text}
          </button>
        ))}
      </div>
    </div>
  );
}
