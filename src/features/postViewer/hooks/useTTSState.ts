'use client';

import {
  TTS,
  toProps as toTTSProps,
} from '@/features/postViewer/domain/model/tts';
import usePostViewer from '@/features/postViewer/hooks/usePostViewer';
import useDebounce from '@/hooks/useDebounce';
import { setIsControlBarTouched } from '@/lib/redux/postViewerSlice';
import { AppDispatch } from '@/lib/redux/store';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

export default function useTTSState() {
  const [tts, setTTS] = useState<TTS>({
    isPlaying: false,
    elementIndex: 0,
  });

  const dispatch = useDispatch<AppDispatch>();
  const debounce = useDebounce();
  const { pageNumber, isViewerMode } = usePostViewer();
  const ttsProps = useMemo(() => toTTSProps(tts), [tts]);

  const lastPageNumber = useRef(pageNumber);

  const toggleIsPlaying = useCallback(() => {
    setTTS(prev => ({ ...prev, isPlaying: !ttsProps.isPlaying }));
  }, [ttsProps]);

  const onPlayButtonClick = useCallback(() => {
    toggleIsPlaying();

    dispatch(setIsControlBarTouched(true));
    debounce(() => dispatch(setIsControlBarTouched(false)), 2000);
  }, [debounce, dispatch, toggleIsPlaying]);

  const increaseElementIndex = useCallback(
    () =>
      setTTS(prev => ({
        ...prev,
        elementIndex: prev.elementIndex + 1,
      })),
    []
  );

  useEffect(() => {
    if (!isViewerMode) {
      setTTS({
        isPlaying: false,
        elementIndex: 0,
      });
    }
  }, [isViewerMode]);

  useEffect(() => {
    if (pageNumber === lastPageNumber.current) return;
    lastPageNumber.current = pageNumber;

    if (ttsProps.isPlaying) {
      setTTS({
        isPlaying: true,
        elementIndex: 0,
      });
    }
  }, [pageNumber, ttsProps]);

  return {
    ttsProps,
    onPlayButtonClick,
    increaseElementIndex,
  } as const;
}
