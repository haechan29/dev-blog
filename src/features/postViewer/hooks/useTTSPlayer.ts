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
  const [elements, setElements] = useState<HTMLElement[]>([]);
  const currentPageRef = useRef<number>(pageNumber);
  const [elementIndex, setElementIndex] = useState(0);

  const addHighlight = useCallback(
    (elementIndex: number) => {
      elements.forEach((element, index) => {
        element.classList.remove('tts-reading-active', 'tts-reading-inactive');

        if (index === elementIndex) {
          element.classList.add('tts-reading-active');
        } else {
          element.classList.add('tts-reading-inactive');
        }
      });
    },
    [elements]
  );

  const clearHighlight = useCallback(() => {
    elements.forEach(element => {
      element.classList.remove('tts-reading-active', 'tts-reading-inactive');
    });
  }, [elements]);

  useEffect(() => {
    if (!isViewerMode || elements.length === 0) return;

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
    elements,
    isPlaying,
    isViewerMode,
  ]);

  useEffect(() => {
    const container = document.querySelector('[data-viewer-container]');
    if (!container) return;

    const updateElements = () => {
      const newElements = (
        Array.from(container.children) as HTMLElement[]
      ).filter(element => element.textContent.trim().length > 0);
      setElements(newElements);
    };
    updateElements();

    const observer = new ResizeObserver(updateElements);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

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
