'use client';

import PostViewerTTSSection from '@/components/postViewer/ttsSection';
import TooltipItem from '@/components/tooltipItem';
import { toProps as toPostViewerProps } from '@/features/postViewer/domain/model/postViewer';
import { setIsViewerMode } from '@/lib/redux/postViewerSlice';
import { AppDispatch, RootState } from '@/lib/redux/store';
import clsx from 'clsx';
import { Minimize } from 'lucide-react';
import { RefObject, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AutoAdvanceSection from './autoAdvanceSection';

export default function PostViewerControlBar({
  pageRef,
}: {
  pageRef: RefObject<HTMLDivElement | null>;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const postViewer = useSelector((state: RootState) => state.postViewer);

  const {
    isViewerMode,
    isControlBarVisible,
    pageIndex,
    totalPages,
    advanceMode,
  } = useMemo(() => toPostViewerProps(postViewer), [postViewer]);

  const progress = useMemo(() => {
    return (pageIndex / (totalPages - 1)) * 100;
  }, [pageIndex, totalPages]);

  return (
    <div
      className={clsx(
        'fixed bottom-0 left-0 right-0 flex flex-col bg-white/80 backdrop-blur-md',
        'transition-transform|opacity duration-300 ease-in-out',
        !isControlBarVisible && 'translate-y-full opacity-0'
      )}
    >
      <div className='px-10'>
        <div className='relative w-full h-0.5 bg-gray-200'>
          <div
            className='relative h-0.5 bg-blue-500'
            style={{ width: `${progress}%` }}
          >
            <div className='absolute w-3 h-3 -top-1 -right-1.5 bg-blue-500 rounded-full' />
          </div>
        </div>
      </div>

      <div className='flex w-full py-3 px-10 justify-between items-center'>
        <div className='flex items-center gap-2'>
          <div className='flex items-center text-sm whitespace-nowrap mr-4'>
            <span>{pageIndex + 1}</span>
            <span className='mx-1'>/</span>
            <span>{totalPages}</span>
          </div>

          <PostViewerTTSSection
            pageRef={pageRef}
            isViewerMode={isViewerMode}
            pageIndex={pageIndex}
          />

          <AutoAdvanceSection
            pageIndex={pageIndex}
            totalPages={totalPages}
            advanceMode={advanceMode}
          />
        </div>

        <TooltipItem text='전체화면 해제'>
          <button
            onClick={() => dispatch(setIsViewerMode(false))}
            className='flex shrink-0 p-2 cursor-pointer'
            aria-label='전체화면 끄기'
          >
            <Minimize className='w-6 h-6 hover:animate-pop hover:[--scale:0.8]' />
          </button>
        </TooltipItem>
      </div>
    </div>
  );
}
