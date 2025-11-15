/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {
  setIsError,
  setIsPlaying,
  setIsReady,
  setIsWaiting,
} from '@/lib/redux/bgmControllerSlice';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function BgmController() {
  const dispatch = useDispatch<AppDispatch>();
  const playerRef = useRef<any>(null);
  const { videoId, start, isPlaying, isError, isWaiting, isReady } =
    useSelector((state: RootState) => state.bgmController);

  const onYoutubeAPIReady = useRef<(() => void)[]>([]);

  const initPlayer = useCallback(
    (videoId: string, start: number) => {
      const bgmPlayers = document.querySelectorAll('[data-bgm-player]');
      const container = Array.from(bgmPlayers).find(player => {
        const videoIdAttr = (player as HTMLElement).getAttribute(
          'data-bgm-video-id'
        );
        return videoId === videoIdAttr;
      });
      if (!container) return;

      dispatch(setIsError(false));
      dispatch(setIsPlaying(false));
      dispatch(setIsWaiting(false));
      dispatch(setIsReady(false));
      container.innerHTML = '';
      const bgmPlayer = document.createElement('div');
      container.appendChild(bgmPlayer);

      try {
        playerRef.current = new window.YT.Player(bgmPlayer, {
          videoId,
          playerVars: {
            loop: 1,
            playlist: videoId,
            start,
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

  const togglePlay = useCallback(() => {
    if (!playerRef.current) return;
    const player = playerRef.current;

    if (!isReady) {
      dispatch(setIsWaiting(true));
    } else if (isPlaying) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  }, [dispatch, isPlaying, isReady]);

  useEffect(() => {
    if (!window.YT) {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(script);
      window.onYouTubeIframeAPIReady = () => {
        onYoutubeAPIReady.current.forEach(callback => callback());
        onYoutubeAPIReady.current.length = 0;
      };
    }

    return () => {
      playerRef.current?.destroy?.();
      playerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (videoId === null) return;
    const newStart = start ?? 0;

    if (window.YT?.Player) {
      initPlayer(videoId, newStart);
    } else {
      onYoutubeAPIReady.current.push(() => initPlayer(videoId, newStart));
    }
  }, [initPlayer, start, videoId]);

  useEffect(() => {
    if (isReady && isWaiting) {
      playerRef.current?.playVideo?.();
      dispatch(setIsWaiting(false));
    }
  }, [dispatch, isReady, isWaiting]);

  return (
    <div
      data-bgm-controller
      className='fixed top-0 left-0 bg-black w-40 h-40'
    />
  );
}
