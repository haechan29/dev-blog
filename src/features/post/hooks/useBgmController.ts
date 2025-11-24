/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {
  clearController,
  clearRequestedBgm,
  hideVideo,
  setIsError,
  setIsPlaying,
  setIsReady,
  setIsWaiting,
} from '@/lib/redux/bgmControllerSlice';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function useBgmController() {
  const dispatch = useDispatch<AppDispatch>();
  const playerRef = useRef<any>(null);
  const {
    isPlaying,
    isWaiting,
    isReady,
    isVideoVisible,
    currentContainerId,
    requestedBgm,
  } = useSelector((state: RootState) => state.bgmController);

  const { isViewerMode, currentPageIndex } = useSelector((state: RootState) => {
    return state.postViewer;
  });

  const initPlayer = useCallback(
    ({
      videoId,
      start,
      containerId,
    }: {
      videoId: string | null;
      start: number | null;
      containerId: string | null;
    }) => {
      if (videoId === null || containerId === null) return;
      const newStart = start ?? 0;

      const container = document.querySelector(
        `[data-bgm-container-id="${containerId}"]`
      );
      if (!container) return;

      dispatch(clearController());
      playerRef.current?.destroy?.();

      container.innerHTML = '';
      const bgmPlayer = document.createElement('div');
      container.appendChild(bgmPlayer);

      try {
        playerRef.current = new window.YT.Player(bgmPlayer, {
          videoId,
          playerVars: {
            loop: 1,
            playlist: videoId,
            start: newStart,
          },
          events: {
            onReady: () => {
              dispatch(setIsReady(true));
            },
            onError: () => {
              dispatch(setIsError(true));
            },
            onStateChange: (event: any) => {
              dispatch(
                setIsPlaying(event.data === window.YT.PlayerState.PLAYING)
              );
            },
          },
        });
      } catch {
        setIsError(true);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    if (!window.YT) {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(script);
    }

    return () => {
      playerRef.current?.destroy?.();
      playerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (requestedBgm.videoId === null) return;
    if (
      currentContainerId === null ||
      currentContainerId !== requestedBgm.containerId
    ) {
      if (window.YT?.Player) {
        initPlayer(requestedBgm);
      } else {
        window.onYouTubeIframeAPIReady = () => initPlayer(requestedBgm);
      }
    }

    if (!(isReady && currentContainerId === requestedBgm.containerId)) {
      dispatch(setIsWaiting(true));
    } else if (isPlaying) {
      playerRef.current?.pauseVideo?.();
    } else {
      playerRef.current?.playVideo?.();
    }
    dispatch(clearRequestedBgm());
  }, [
    currentContainerId,
    dispatch,
    initPlayer,
    isPlaying,
    isReady,
    requestedBgm,
  ]);

  useEffect(() => {
    if (isReady && isWaiting) {
      playerRef.current?.playVideo?.();
      dispatch(setIsWaiting(false));
    }
  }, [dispatch, isReady, isWaiting]);

  useEffect(() => {
    if (!isVideoVisible) return;

    const hideOnMove = () => dispatch(hideVideo());

    window.addEventListener('scroll', hideOnMove, { passive: true });
    window.addEventListener('resize', hideOnMove, { passive: true });

    return () => {
      window.removeEventListener('scroll', hideOnMove);
      window.removeEventListener('resize', hideOnMove);
    };
  }, [dispatch, isVideoVisible]);

  useEffect(() => {
    if (currentPageIndex === null) return;
    dispatch(hideVideo());
  }, [dispatch, currentPageIndex]);

  useEffect(() => {
    dispatch(clearController());
    playerRef.current?.destroy?.();
    playerRef.current = null;
  }, [dispatch, isViewerMode]);
}
