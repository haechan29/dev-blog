'use client';

import PostViewerContainer from '@/components/postViewer/postViewerContainer';
import PostViewerControlBar from '@/components/postViewer/postViewerControlBar';
import PostViewerToolbar from '@/components/postViewer/postViewerToolbar';
import { PostProps } from '@/features/post/ui/postProps';
import useDebounce from '@/hooks/useDebounce';
import useScrollLock from '@/hooks/useScrollLock';
import useThrottle from '@/hooks/useThrottle';
import { canTouch } from '@/lib/browser';
import {
  nextPage,
  previousPage,
  setIsMouseMoved,
  setIsPageTransitioning,
  setIsRotationFinished,
  setIsTouched,
  setIsViewerMode,
} from '@/lib/redux/post/postViewerSlice';
import { AppDispatch, RootState } from '@/lib/redux/store';
import clsx from 'clsx';
import {
  MouseEvent,
  TransitionEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';

const SWIPE_THRESHOLD = 50;
const PAGE_TRANSITIONING_DURATION = 1000;

export default function PostViewer({ post }: { post: PostProps }) {
  const dispatch = useDispatch<AppDispatch>();
  const isViewerMode = useSelector((state: RootState) => {
    return state.postViewer.isViewerMode;
  });
  const throttle = useThrottle();
  const debounceTouch = useDebounce();
  const debounceSwipe = useDebounce();
  const debounceMouseMove = useDebounce();
  const debounceRotation = useDebounce();
  const [supportsFullscreen, setSupportsFullscreen] = useState(true);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleNavigation = useCallback(
    ({
      clientX,
      clientY,
      currentTarget,
    }: {
      clientX: number;
      clientY: number;
      currentTarget: HTMLDivElement;
    }) => {
      if (typeof document === 'undefined') return;

      const { width, height } = currentTarget.getBoundingClientRect();
      const [isLeftSideClicked, isRightSideClicked] = supportsFullscreen
        ? [clientX < width / 2, clientX > width / 2]
        : [clientY < height / 2, clientY > height / 2];

      if (isLeftSideClicked) {
        dispatch(previousPage());
      } else if (isRightSideClicked) {
        dispatch(nextPage());
      }

      dispatch(setIsPageTransitioning(true));
      debounceSwipe(
        () => dispatch(setIsPageTransitioning(false)),
        PAGE_TRANSITIONING_DURATION
      );
    },
    [debounceSwipe, dispatch, supportsFullscreen]
  );

  const handleTouchStart = useCallback(
    (event: React.TouchEvent<HTMLDivElement>) => {
      const touch = event.touches[0];
      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    },
    []
  );

  const handleTouchEnd = useCallback(
    (event: React.TouchEvent<HTMLDivElement>) => {
      if (!touchStartRef.current) return;

      const touch = event.changedTouches[0];
      const delta = supportsFullscreen
        ? touch.clientX - touchStartRef.current.x
        : touch.clientY - touchStartRef.current.y;

      if (Math.abs(delta) > SWIPE_THRESHOLD) {
        if (delta > 0) {
          dispatch(previousPage());
        } else {
          dispatch(nextPage());
        }
        dispatch(setIsPageTransitioning(true));
        debounceSwipe(
          () => dispatch(setIsPageTransitioning(false)),
          PAGE_TRANSITIONING_DURATION
        );
      } else {
        dispatch(setIsTouched(true));
        debounceTouch(() => dispatch(setIsTouched(false)), 2000);
      }

      touchStartRef.current = null;
    },
    [debounceSwipe, debounceTouch, dispatch, supportsFullscreen]
  );

  useScrollLock({
    isLocked: isViewerMode,
    allowedSelectors: [
      '[data-viewer-toolbar-content]',
      '[data-image-container]',
    ],
  });

  useEffect(() => {
    const viewer = document.querySelector('[data-viewer]') as HTMLElement;
    if (!viewer) return;

    if (isViewerMode) {
      if (viewer.requestFullscreen) {
        viewer.requestFullscreen();
      }
    } else {
      if (document.fullscreenElement) {
        document.exitFullscreen?.();
      }
    }
  }, [isViewerMode]);

  useEffect(() => {
    setSupportsFullscreen(!!document.exitFullscreen);
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && isViewerMode) {
        dispatch(setIsViewerMode(false));
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () =>
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [dispatch, isViewerMode]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        // don't handle keydown on input and text area
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') {
        dispatch(previousPage());
        dispatch(setIsPageTransitioning(true));
        debounceSwipe(
          () => dispatch(setIsPageTransitioning(false)),
          PAGE_TRANSITIONING_DURATION
        );
      } else if (
        event.key === 'ArrowRight' ||
        event.key.toLowerCase() === 'd'
      ) {
        dispatch(nextPage());
        dispatch(setIsPageTransitioning(true));
        debounceSwipe(
          () => dispatch(setIsPageTransitioning(false)),
          PAGE_TRANSITIONING_DURATION
        );
      }
    };

    if (isViewerMode) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [debounceSwipe, dispatch, isViewerMode]);

  return (
    <div
      data-viewer
      onClick={(event: MouseEvent<HTMLDivElement>) => {
        if (!canTouch) {
          handleNavigation(event);
        }
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseMove={() => {
        if (canTouch) return;
        throttle(() => {
          dispatch(setIsMouseMoved(true));
          debounceMouseMove(() => dispatch(setIsMouseMoved(false)), 2000);
        }, 100);
      }}
      onTransitionEnd={(event: TransitionEvent<HTMLElement>) => {
        if (
          !isViewerMode ||
          event.target !== event.currentTarget ||
          event.propertyName !== 'rotate'
        ) {
          return;
        }

        dispatch(setIsRotationFinished(true));
        debounceRotation(() => dispatch(setIsRotationFinished(false)), 2000);
      }}
      className={clsx(
        'fixed inset-0 z-40 p-(--container-padding) bg-white',
        !supportsFullscreen &&
          'transition-transform|opacity duration-300 ease-in-out translate-x-[100dvw]',
        !isViewerMode && 'opacity-0 pointer-events-none',
        !supportsFullscreen &&
          isViewerMode &&
          'w-dvh h-dvw rotate-90 origin-top-left'
      )}
    >
      <Toaster toasterId='viewer' />

      <PostViewerToolbar {...post} />
      <PostViewerContainer
        content={post.content}
        supportsFullscreen={supportsFullscreen}
      />
      <PostViewerControlBar />
    </div>
  );
}
