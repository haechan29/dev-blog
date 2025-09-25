'use client';

import { toProps as toPostViewerProps } from '@/features/postViewer/domain/model/postViewer';
import {
  TTS,
  toProps as toTTSProps,
} from '@/features/postViewer/domain/model/tts';
import { setAdvanceMode } from '@/lib/redux/postViewerSlice';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function useTTSState() {
  const [tts, setTTS] = useState<TTS>({
    isEnabled: false,
    isPlaying: false,
    elementIndex: 0,
  });

  const dispatch = useDispatch<AppDispatch>();
  const postViewer = useSelector((state: RootState) => state.postViewer);
  const { pageIndex, isViewerMode, advanceMode } = useMemo(
    () => toPostViewerProps(postViewer),
    [postViewer]
  );
  const ttsProps = useMemo(() => toTTSProps(tts), [tts]);

  const lastPageIndex = useRef(pageIndex);

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
    if (pageIndex === lastPageIndex.current) return;
    lastPageIndex.current = pageIndex;

    if (ttsProps.mode === 'enabled' && ttsProps.isPlaying) {
      setTTS({
        isEnabled: true,
        isPlaying: true,
        elementIndex: 0,
      });
    }
  }, [pageIndex, ttsProps]);

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
    toggleIsEnabled,
    toggleIsPlaying,
    increaseElementIndex,
  } as const;
}
