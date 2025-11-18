'use client';

import { BgmInner, VIEWER_BGM_CONTAINER_ID } from '@/components/md/bgm';
import { Bgm } from '@/features/post/domain/types/bgm';
import useKeyboardWheelNavigation from '@/features/postViewer/hooks/useKeyboardWheelNavigation';
import usePostViewer from '@/features/postViewer/hooks/usePostViewer';
import useViewerPagination from '@/features/postViewer/hooks/useViewerPagination';
import { processMd } from '@/lib/md/md';
import clsx from 'clsx';
import { JSX, useEffect, useState } from 'react';

interface ViewerProps {
  result: JSX.Element;
  bgm: Bgm | null;
  scale?: number;
  caption?: string;
}

export default function PostViewerContainer({ content }: { content: string }) {
  useViewerPagination();
  const { page } = usePostViewer();
  const [viewer, setViewer] = useState<ViewerProps>();
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
          scale,
          caption,
        });
      });
    };
    updateViewer();
  }, [content, page]);

  return (
    viewer && (
      <div className='prose absolute inset-[var(--container-padding)] m-auto'>
        <div
          data-viewer-container
          className={clsx(
            'w-[calc(100%/var(--page-scale))]',
            'h-[calc(100%/var(--page-scale))]',
            'absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 scale-[var(--page-scale)]'
          )}
          style={{
            '--page-scale': viewer.scale
              ? `${viewer.scale}`
              : 'var(--container-scale)',
          }}
        >
          {viewer?.result}
        </div>

        {viewer?.caption?.trim() && (
          <div
            className={clsx(
              'absolute left-1/2 -translate-x-1/2 bottom-0 flex justify-center',
              'w-[calc(100%/var(--container-scale))] scale-[var(--container-scale)]'
            )}
          >
            <div className='w-fit bg-black/70 text-white text-center break-keep wrap-anywhere text-balance px-2 py-1'>
              {viewer.caption}
            </div>
          </div>
        )}

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
    )
  );
}
