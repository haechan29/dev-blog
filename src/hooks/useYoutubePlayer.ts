/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { RefObject, useCallback, useEffect, useRef, useState } from 'react';

export default function useYoutubePlayer({
  videoId,
  start,
  containerRef,
}: {
  videoId: string | null;
  start: number | null;
  containerRef: RefObject<Element | null>;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isWaiting, setWaiting] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const playerRef = useRef<any>(null);

  const initPlayer = useCallback(
    (videoId: string, start: number) => {
      if (!containerRef.current) return;

      setIsError(false);
      setIsPlaying(false);
      setWaiting(false);
      setIsReady(false);
      playerRef.current?.destroy();

      playerRef.current = new window.YT.Player(containerRef.current, {
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
    },
    [containerRef]
  );

  const togglePlay = useCallback(() => {
    if (!playerRef.current) return;
    const player = playerRef.current;

    if (!isReady) {
      setWaiting(true);
    } else if (isPlaying) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  }, [isPlaying, isReady]);

  useEffect(() => {
    if (!window.YT) {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(script);
    }
  }, []);

  useEffect(() => {
    if (videoId === null) return;
    const newStart = start ?? 0;

    if (window.YT && window.YT.Player) {
      initPlayer(videoId, newStart);
    } else {
      window.onYouTubeIframeAPIReady = () => initPlayer(videoId, newStart);
    }

    return () => {
      if (playerRef.current?.destroy) {
        playerRef.current.destroy();
      }
    };
  }, [initPlayer, start, videoId]);

  useEffect(() => {
    if (isReady && isWaiting) {
      playerRef.current?.playVideo();
      setWaiting(false);
    }
  }, [isReady, isWaiting]);

  return {
    isPlaying,
    isError,
    isWaiting,
    togglePlay,
  } as const;
}
