/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {
  clearRequestedBgm,
  hideVideo,
  setIsError,
  setIsPlaying,
  setIsReady,
  setIsWaiting,
} from '@/lib/redux/bgmControllerSlice';
import { AppDispatch, RootState } from '@/lib/redux/store';
import clsx from 'clsx';
import { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function BgmController() {
  const dispatch = useDispatch<AppDispatch>();
  const playerRef = useRef<any>(null);
  const {
    isPlaying,
    isWaiting,
    isReady,
    isVideoVisible,
    position,
    requestedBgm,
  } = useSelector((state: RootState) => state.bgmController);

  const initPlayer = useCallback(
    ({ videoId, start }: { videoId: string | null; start: number | null }) => {
      if (videoId === null) return;
      const newStart = start ?? 0;

      const bgmController = document.querySelector('[data-bgm-controller]');
      if (!bgmController) return;

      dispatch(setIsError(false));
      dispatch(setIsPlaying(false));
      dispatch(setIsWaiting(false));
      dispatch(setIsReady(false));
      bgmController.innerHTML = '';
      const bgmPlayer = document.createElement('div');
      bgmController.appendChild(bgmPlayer);

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
    const prevVideoId = playerRef.current?.getVideoData?.().video_id;
    if (prevVideoId === null || prevVideoId !== requestedBgm.videoId) {
      if (window.YT?.Player) {
        initPlayer(requestedBgm);
      } else {
        window.onYouTubeIframeAPIReady = () => initPlayer(requestedBgm);
      }
    }

    if (!isReady) {
      dispatch(setIsWaiting(true));
    } else if (isPlaying) {
      playerRef.current?.pauseVideo?.();
    } else {
      playerRef.current?.playVideo?.();
    }
    dispatch(clearRequestedBgm());
  }, [dispatch, initPlayer, isPlaying, isReady, requestedBgm]);

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

  return (
    <div
      data-bgm-controller
      className={clsx('fixed z-[4000]', !isVideoVisible && 'hidden')}
      style={{
        top: position?.top ?? 0,
        left: position?.left ?? 0,
      }}
    />
  );
}
