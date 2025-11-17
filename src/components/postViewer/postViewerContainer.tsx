'use client';

import { BgmInner, VIEWER_BGM_CONTAINER_ID } from '@/components/md/bgm';
import { Bgm } from '@/features/post/domain/types/bgm';
import useClickTouchNavigationHandler from '@/features/postViewer/hooks/useClickTouchNavigationHandler';
import useKeyboardWheelNavigation from '@/features/postViewer/hooks/useKeyboardWheelNavigation';
import usePostViewer from '@/features/postViewer/hooks/usePostViewer';
import useViewerPagination from '@/features/postViewer/hooks/useViewerPagination';
import { processMd } from '@/lib/md/md';
import clsx from 'clsx';
import { JSX, useEffect, useState } from 'react';

interface ViewerProps {
  result: JSX.Element;
  bgm: Bgm | null;
  scale: number;
  caption: string;
}

export default function PostViewerContainer({ content }: { content: string }) {
  useViewerPagination();
  const { page } = usePostViewer();
  const [viewer, setViewer] = useState<ViewerProps>();
  const navigationHandler = useClickTouchNavigationHandler();
  useKeyboardWheelNavigation();

  useEffect(() => {
    const updateViewer = async () => {
      if (!page) return;
      const { startOffset, endOffset, caption, bgm, scale } = page;

      await processMd({
        source: content.slice(startOffset, endOffset),
        mode: 'viewer',
      }).then(result => {
        setViewer({
          result,
          bgm,
          scale: scale ?? 1,
          caption: caption ?? '',
        });
      });
    };
    updateViewer();
  }, [content, page]);

  return (
    viewer && (
      <div
        {...navigationHandler}
        className='w-full h-full p-[var(--container-padding)]'
      >
        <div data-viewer-container className='prose w-full h-full relative'>
          <div
            data-viewer-content
            className={clsx(
              'w-[calc(100%/var(--container-scale))]',
              'h-[calc(100%/var(--container-scale))]',
              'absolute inset-0 m-auto scale-[var(--container-scale)] origin-center'
            )}
          >
            {viewer?.result}
            {viewer?.caption.trim() && (
              <div className='absolute bottom-0 inset-x-0 mx-auto'>
                <div className='bg-black/70 text-white text-center break-keep wrap-anywhere text-balance px-2 py-1'>
                  {viewer.caption}
                </div>
              </div>
            )}
          </div>

          {viewer?.bgm && (
            <div
              className='absolute top-0 right-0'
              onClick={e => e.stopPropagation()}
            >
              <BgmInner
                {...viewer.bgm}
                containerId={VIEWER_BGM_CONTAINER_ID}
                mode='viewer'
              />
            </div>
          )}
        </div>
      </div>
    )
  );
}
