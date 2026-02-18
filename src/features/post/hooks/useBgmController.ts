'use client';

import {
  clearController,
  clearRequestedBgm,
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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { isPlaying, isWaiting, isReady, currentContainerId, requestedBgm } =
    useSelector((state: RootState) => state.bgmController);

  const initPlayer = useCallback(
    ({
      src,
      containerId,
    }: {
      src: string | null;
      containerId: string | null;
    }) => {
      if (src === null || containerId === null) return;

      dispatch(clearController());
      audioRef.current?.pause();
      audioRef.current = null;

      try {
        const audio = new Audio(src);
        audio.loop = true;

        audio.oncanplaythrough = () => {
          dispatch(setIsReady(true));
        };

        audio.onplay = () => {
          dispatch(setIsPlaying(true));
        };

        audio.onpause = () => {
          dispatch(setIsPlaying(false));
        };

        audio.onerror = () => {
          dispatch(setIsError(true));
        };

        audioRef.current = audio;
      } catch {
        dispatch(setIsError(true));
      }
    },
    [dispatch]
  );

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (requestedBgm.src === null) return;

    const isSameContainer = currentContainerId === requestedBgm.containerId;

    if (isSameContainer) {
      if (isPlaying) {
        audioRef.current?.pause();
      } else {
        audioRef.current?.play();
      }
    } else {
      initPlayer(requestedBgm);
      dispatch(setIsWaiting(true));
    }

    dispatch(clearRequestedBgm());
  }, [currentContainerId, dispatch, initPlayer, isPlaying, requestedBgm]);

  useEffect(() => {
    if (isReady && isWaiting) {
      audioRef.current?.play();
      dispatch(setIsWaiting(false));
    }
  }, [dispatch, isReady, isWaiting]);
}
