'use client';

import PostViewerContent from '@/components/post/postViewerContent';
import PostViewerControlBar from '@/components/post/postViewerControlBar';
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
import { useDispatch, useSelector } from 'react-redux';

export default function PostViewer() {
  const dispatch = useDispatch<AppDispatch>();
  const postViewer = useSelector((state: RootState) => state.postViewer);
  const postViewerRef = useRef<HTMLDivElement | null>(null);

  const debounce3Seconds = useDebounce(3000);
  const throttle100Ms = useThrottle(100);

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
      throttle100Ms(() => {
        dispatch(setIsControlBarVisible(true));
        debounce3Seconds(() => dispatch(setIsControlBarVisible(false)));
      });
    };

    const handleScroll = (event: WheelEvent) => {
      throttle100Ms(() => {
        if (event.deltaY > 0) {
          dispatch(nextPage());
        } else if (event.deltaY < 0) {
          dispatch(previousPage());
        }
      });
    };

    if (postViewer.isViewerMode) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('wheel', handleScroll);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('wheel', handleScroll);
    };
  }, [debounce3Seconds, dispatch, postViewer.isViewerMode, throttle100Ms]);

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
