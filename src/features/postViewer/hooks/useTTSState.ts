'use client';

import {
  TTS,
  toProps as toTTSProps,
} from '@/features/postViewer/domain/model/tts';
import usePostViewer from '@/features/postViewer/hooks/usePostViewer';
import useDebounce from '@/hooks/useDebounce';
import {
  setAdvanceMode,
  setIsControlBarTouched,
} from '@/lib/redux/postViewerSlice';
import { AppDispatch } from '@/lib/redux/store';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

export default function useTTSState() {
  const [tts, setTTS] = useState<TTS>({
    isEnabled: false,
    isPlaying: false,
    elementIndex: 0,
  });

  const dispatch = useDispatch<AppDispatch>();
  const debounce = useDebounce();
  const { pageNumber, isViewerMode, advanceMode } = usePostViewer();
  const ttsProps = useMemo(() => toTTSProps(tts), [tts]);

  const lastPageNumber = useRef(pageNumber);

  const toggleIsEnabled = useCallback(() => {
    if (ttsProps.mode === 'enabled') {
      setTTS({
        isEnabled: false,
        isPlaying: false,
        elementIndex: 0,
      });
    } else if (ttsProps.mode === 'disabled') {
      setTTS({
        isEnabled: true,
        isPlaying: true,
        elementIndex: 0,
      });
    }
  }, [ttsProps.mode]);

  const toggleIsPlaying = useCallback(() => {
    if (ttsProps.mode !== 'enabled') return;
    setTTS(prev => ({ ...prev, isPlaying: !ttsProps.isPlaying }));
  }, [ttsProps]);

  const onEnableButtonClick = useCallback(() => {
    toggleIsEnabled();

    dispatch(setIsControlBarTouched(true));
    debounce(() => dispatch(setIsControlBarTouched(false)), 2000);
  }, [debounce, dispatch, toggleIsEnabled]);

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
        isEnabled: false,
        isPlaying: false,
        elementIndex: 0,
      });
    }
  }, [isViewerMode]);

  useEffect(() => {
    if (pageNumber === lastPageNumber.current) return;
    lastPageNumber.current = pageNumber;

    if (ttsProps.mode === 'enabled' && ttsProps.isPlaying) {
      setTTS({
        isEnabled: true,
        isPlaying: true,
        elementIndex: 0,
      });
    }
  }, [pageNumber, ttsProps]);

  useEffect(() => {
    if (advanceMode !== null && advanceMode !== 'tts') {
      setTTS({
        isEnabled: false,
        isPlaying: false,
        elementIndex: 0,
      });
    }
  }, [advanceMode, setTTS]);

  useEffect(() => {
    if (ttsProps.mode === 'enabled') {
      dispatch(setAdvanceMode('tts'));
    } else if (ttsProps.mode === 'disabled') {
      dispatch(setAdvanceMode(null));
    }
  }, [dispatch, ttsProps.mode]);

  return {
    ttsProps,
    onEnableButtonClick,
    onPlayButtonClick,
    increaseElementIndex,
  } as const;
}
