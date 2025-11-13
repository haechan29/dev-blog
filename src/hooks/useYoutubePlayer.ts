/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import useWritePost from '@/features/write/hooks/useWritePost';
import { AppDispatch } from '@/lib/redux/store';
import { setActiveVideoId } from '@/lib/redux/write/writePostSlice';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

export default function useYoutubePlayer({
  videoId,
  start,
}: {
  videoId: string | null;
  start: number | null;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const {
    writePost: { activeVideoId },
  } = useWritePost();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isWaiting, setWaiting] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const playerRef = useRef<any>(null);

  const initPlayer = useCallback((videoId: string, start: number) => {
    const bgmPlayers = document.querySelectorAll('[data-bgm-player]');
    const container = Array.from(bgmPlayers).find(player => {
      const videoIdAttr = (player as HTMLElement).getAttribute(
        'data-bgm-video-id'
      );
      return videoId === videoIdAttr;
    });
    if (!container) return;

    setIsError(false);
    setIsPlaying(false);
    setWaiting(false);
    setIsReady(false);
    playerRef.current?.destroy?.();

    playerRef.current = new window.YT.Player(container, {
      videoId,
      playerVars: {
        loop: 1,
        playlist: videoId,
        start,
      },
      events: {
        onReady: () => {
          setIsReady(true);
        },
        onError: () => {
          setIsError(true);
        },
        onStateChange: (event: any) => {
          setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
        },
      },
    });
  }, []);

  const togglePlay = useCallback(() => {
    if (!playerRef.current || videoId === null) return;
    const player = playerRef.current;

    dispatch(setActiveVideoId(videoId));

    if (!isReady) {
      setWaiting(true);
    } else if (isPlaying) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  }, [dispatch, isPlaying, isReady, videoId]);

  useEffect(() => {
    if (videoId === null) return;
    const newStart = start ?? 0;

    if (!window.YT) {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(script);
      window.onYouTubeIframeAPIReady = () => {
        onYoutubeAPIReady.forEach(callback => callback());
        onYoutubeAPIReady.length = 0;
      };
    }

    if (window.YT?.Player) {
      initPlayer(videoId, newStart);
    } else {
      onYoutubeAPIReady.push(() => initPlayer(videoId, newStart));
    }

    return () => {
      playerRef.current?.destroy?.();
      playerRef.current = null;
    };
  }, [initPlayer, start, videoId]);

  useEffect(() => {
    if (isReady && isWaiting) {
      playerRef.current?.playVideo?.();
      setWaiting(false);
    }
  }, [isReady, isWaiting]);

  useEffect(() => {
    if (isReady && activeVideoId !== videoId) {
      playerRef.current?.pauseVideo?.();
    }
  }, [activeVideoId, isReady, videoId]);

  return {
    isPlaying,
    isError,
    isWaiting,
    togglePlay,
  } as const;
}

const onYoutubeAPIReady: (() => void)[] = [];
