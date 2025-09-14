'use client';

import useMediaQuery from '@/hooks/useMediaQuery';
import useThrottle from '@/hooks/useThrottle';
import {
  setIsContentVisible,
  setSelectedTitle,
} from '@/lib/redux/postToolbarSlice';
import { AppDispatch, RootState } from '@/lib/redux/store';
import clsx from 'clsx';
import { ChevronRight, Menu } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function PostToolbar({ className }: { className?: string }) {
  const breadcrumb = useSelector(
    (state: RootState) => state.postToolbar.breadcrumb
  );
  const selectedTitle = useSelector(
    (state: RootState) => state.postToolbar.selectedTitle
  );
  const titles = useSelector((state: RootState) => state.postToolbar.titles);
  const isContentVisible = useSelector(
    (state: RootState) => state.postToolbar.isContentVisible
  );
  const dispatch = useDispatch<AppDispatch>();

  const [throttle100Ms] = useThrottle(100);
  const isLargerThanXl = useMediaQuery('(min-width: 1280px)');

  const getActiveTitle = useCallback(() => {
    const targetElementsInVisibleArea = titles.filter(title => {
      const element = document.getElementById(title);
      if (!element) return false;

      const rect = element.getBoundingClientRect();
      return rect.top >= 10 && rect.top <= 20;
    });

    if (targetElementsInVisibleArea.length > 0) {
      return targetElementsInVisibleArea[0];
    }

    const allTargetElementsAbove = titles.filter(title => {
      const element = document.getElementById(title);
      return element && element.getBoundingClientRect().top < 10;
    });

    if (allTargetElementsAbove.length > 0) {
      return allTargetElementsAbove[allTargetElementsAbove.length - 1];
    }

    return null;
  }, [titles]);

  useEffect(() => {
    const proseElement = document.querySelector('.prose');
    if (!proseElement) return;

    const proseObserver = new IntersectionObserver(
      entries => dispatch(setIsContentVisible(entries[0].isIntersecting)),
      {
        rootMargin: '-20px 0px -100% 0px',
      }
    );
    proseObserver.observe(proseElement);
    return () => proseObserver.disconnect();
  }, []);

  useEffect(() => {
    if (isLargerThanXl) return;

    const checkActiveTitle = () => dispatch(setSelectedTitle(getActiveTitle()));
    checkActiveTitle();
    const throttledCheck = () => throttle100Ms(checkActiveTitle);
    window.addEventListener('scroll', throttledCheck);

    return () => {
      window.removeEventListener('scroll', throttledCheck);
    };
  }, [isLargerThanXl, titles]);

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
              selectedTitle !== null && isContentVisible
                ? 'opacity-100'
                : 'opacity-0'
            )}
          >
            {selectedTitle ?? ''}
          </div>
        </div>
      </div>
    </div>
  );
}
