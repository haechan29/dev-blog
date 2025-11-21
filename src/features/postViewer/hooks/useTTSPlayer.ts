'use client';

import { getUtterance } from '@/features/postViewer/domain/lib/tts';
import { nextPage } from '@/lib/redux/post/postViewerSlice';
import { AppDispatch } from '@/lib/redux/store';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

export default function useTTSPlayer({
  isPlaying,
  pageNumber,
  isViewerMode,
}: {
  isPlaying: boolean;
  pageNumber: number | null;
  isViewerMode: boolean;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const isSpeakingRef = useRef<boolean>(false);
  const isPausedRef = useRef<boolean>(false);
  const currentPageRef = useRef<number>(pageNumber);
  const [elementIndex, setElementIndex] = useState(0);

  const getElements = useCallback(() => {
    const content = document.querySelector('[data-viewer-container]');
    if (!content) return;

    return (Array.from(content.children) as HTMLElement[]).filter(
      element => element.textContent.trim().length > 0
    );
  }, []);

  const addHighlight = useCallback(
    (elementIndex: number) => {
      const elements = getElements();
      if (!elements) return;

      elements.forEach((element, index) => {
        element.classList.remove('tts-reading-active', 'tts-reading-inactive');

        if (index === elementIndex) {
          element.classList.add('tts-reading-active');
        } else {
          element.classList.add('tts-reading-inactive');
        }
      });
    },
    [getElements]
  );

  const clearHighlight = useCallback(() => {
    const elements = getElements();
    if (!elements) return;
    elements.forEach(element => {
      element.classList.remove('tts-reading-active', 'tts-reading-inactive');
    });
  }, [getElements]);

  useEffect(() => {
    if (!isViewerMode) return;

    const elements = getElements();
    if (!elements) return;

    if (isPlaying) {
      if (elementIndex >= elements.length) {
        dispatch(nextPage());
        return;
      }

      addHighlight(elementIndex);

      if (isSpeakingRef.current && isPausedRef.current) {
        speechSynthesis.resume();
        isPausedRef.current = false;
        return;
      }

      const element = elements[elementIndex];
      const utterance = getUtterance(element.textContent);

      utterance.onstart = () => {
        isSpeakingRef.current = true;
        isPausedRef.current = false;
      };

      utterance.onend = () => {
        isSpeakingRef.current = false;
        setElementIndex(prev => prev + 1);
      };

      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
    } else {
      if (isSpeakingRef.current) {
        speechSynthesis.pause();
        isPausedRef.current = true;
      }
      clearHighlight();
    }
  }, [
    addHighlight,
    clearHighlight,
    dispatch,
    elementIndex,
    getElements,
    isPlaying,
    isViewerMode,
  ]);

  useEffect(() => {
    if (currentPageRef.current !== pageNumber) {
      speechSynthesis.cancel();
      clearHighlight();
      setElementIndex(0);
      isSpeakingRef.current = false;
      isPausedRef.current = false;
      currentPageRef.current = pageNumber;
    }
  }, [pageNumber, clearHighlight]);

  useEffect(() => {
    return () => {
      speechSynthesis.cancel();
      clearHighlight();
    };
  }, [clearHighlight]);

  useEffect(() => {
    if (!isViewerMode) {
      speechSynthesis.cancel();
      clearHighlight();
      isSpeakingRef.current = false;
      isPausedRef.current = false;
    }
  }, [isViewerMode, clearHighlight]);
}
