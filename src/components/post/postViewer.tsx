'use client';

import PostViewerContent from '@/components/post/postViewerContent';
import PostViewerControlBar from '@/components/post/postViewerControlBar';
import { setIsViewerMode } from '@/lib/redux/postViewerSlice';
import { AppDispatch, RootState } from '@/lib/redux/store';
import clsx from 'clsx';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function PostViewer() {
  const dispatch = useDispatch<AppDispatch>();
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

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && postViewer.isViewerMode) {
        dispatch(setIsViewerMode(false));
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () =>
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [postViewer.isViewerMode, dispatch]);

  return (
    <div
      ref={postViewerRef}
      className={clsx(
        'bg-white flex flex-col',
        !postViewer.isViewerMode && 'hidden'
      )}
    >
      <PostViewerContent />
      <PostViewerControlBar />
    </div>
  );
}
