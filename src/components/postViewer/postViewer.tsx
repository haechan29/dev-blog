'use client';

import PostViewerContainer from '@/components/postViewer/postViewerContainer';
import PostViewerControlBar from '@/components/postViewer/postViewerControlBar';
import PostViewerToolbar from '@/components/postViewer/postViewerToolbar';
import { PostProps } from '@/features/post/ui/postProps';
import usePostViewer from '@/features/postViewer/hooks/usePostViewer';
import useViewerFullscreen from '@/features/postViewer/hooks/useViewerFullscreen';
import useViewerHandler from '@/features/postViewer/hooks/useViewerHandler';
import useScrollLock from '@/hooks/useScrollLock';
import { processMd } from '@/lib/md/md';
import { JSX, useEffect, useRef, useState } from 'react';
import { Toaster } from 'react-hot-toast';

export default function PostViewer({ post }: { post: PostProps }) {
  const { isViewerMode } = usePostViewer();
  const postViewerRef = useRef<HTMLDivElement | null>(null);
  const handlers = useViewerHandler();
  useViewerFullscreen(postViewerRef);
  useScrollLock({ isLocked: isViewerMode });

  const [result, setResult] = useState<JSX.Element | null>(null);

  useEffect(() => {
    const render = async () => {
      await processMd({ source: post.content, mode: 'viewer' }).then(result => {
        setResult(result);
      });
    };
    render();
  }, [post.content]);

  return (
    <>
      <div
        ref={postViewerRef}
        {...handlers}
        className='w-screen h-dvh fixed inset-0 z-40 bg-white opacity-0 pointer-events-none'
      >
        <Toaster toasterId='post-viewer' />

        <PostViewerToolbar {...post} />
        <PostViewerContainer {...post} />
        <PostViewerControlBar />
      </div>

      <div
        data-viewer-measurement
        className='fixed z-1000 w-full left-[100%] top-0'
        aria-hidden='true'
      >
        {result}
      </div>
    </>
  );
}
