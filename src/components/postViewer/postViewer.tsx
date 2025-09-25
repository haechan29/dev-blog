'use client';

import PostViewerContent from '@/components/postViewer/postViewerContent';
import PostViewerControlBar from '@/components/postViewer/postViewerControlBar';
import useDebounce from '@/hooks/useDebounce';
import useThrottle from '@/hooks/useThrottle';
import {
  nextPage,
  previousPage,
  setIsControlBarVisible,
  setIsViewerMode,
} from '@/lib/redux/postViewerSlice';
import { AppDispatch, RootState } from '@/lib/redux/store';
import clsx from 'clsx';
import { useEffect, useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';

export default function PostViewer() {
  const pageRef = useRef<HTMLDivElement | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const postViewer = useSelector((state: RootState) => state.postViewer);
  const postViewerRef = useRef<HTMLDivElement | null>(null);

  const debounce = useDebounce();
  const throttle = useThrottle();

  useEffect(() => {
    if (typeof document === 'undefined' || !postViewerRef.current) return;

    if (postViewer.isViewerMode) {
      postViewerRef.current.requestFullscreen();
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  }, [postViewer.isViewerMode]);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && postViewer.isViewerMode) {
        dispatch(setIsViewerMode(false));
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () =>
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [dispatch, postViewer.isViewerMode]);

  useEffect(() => {
    const handleMouseMove = () => {
      throttle(() => {
        dispatch(setIsControlBarVisible(true));
        debounce(() => dispatch(setIsControlBarVisible(false)), 3000);
      }, 100);
    };

    const handleScroll = (event: WheelEvent) => {
      throttle(() => {
        if (event.deltaY > 0) {
          if (postViewer.pageIndex == postViewer.totalPages - 1) {
            toast.success('마지막 페이지입니다.', {
              id: 'post-viewer',
              toasterId: 'post-viewer',
            });
            return;
          }
          dispatch(nextPage());
        } else if (event.deltaY < 0) {
          if (postViewer.pageIndex == 0) {
            toast.success('첫 페이지입니다.', {
              id: 'post-viewer',
              toasterId: 'post-viewer',
            });
            return;
          }
          dispatch(previousPage());
        }
      }, 100);
    };

    if (postViewer.isViewerMode) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('wheel', handleScroll);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('wheel', handleScroll);
    };
  }, [
    dispatch,
    postViewer.pageIndex,
    postViewer.isViewerMode,
    postViewer.totalPages,
    throttle,
    debounce,
  ]);

  return (
    <div
      ref={postViewerRef}
      className={clsx(
        'bg-white flex flex-col',
        !postViewer.isViewerMode && 'hidden'
      )}
    >
      <PostViewerContent pageRef={pageRef} />
      <PostViewerControlBar pageRef={pageRef} />
      <Toaster toasterId='post-viewer' />
    </div>
  );
}
