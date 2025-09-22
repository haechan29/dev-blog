'use client';

import PostViewerContent from '@/components/post/postViewerContent';
import PostViewerControlBar from '@/components/post/postViewerControlBar';
import { RootState } from '@/lib/redux/store';
import clsx from 'clsx';
import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

export default function PostViewer() {
  const postViewer = useSelector((state: RootState) => state.postViewer);
  const postViewerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof document === 'undefined' || !postViewerRef.current) return;

    if (postViewer.isViewerMode) {
      postViewerRef.current.requestFullscreen();
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  }, [postViewer.isViewerMode]);

  return (
    <div
      ref={postViewerRef}
      className={clsx(
        'bg-white flex flex-col',
        !postViewer.isViewerMode && 'opacity-0'
      )}
    >
      <PostViewerContent />
      <PostViewerControlBar />
    </div>
  );
}
