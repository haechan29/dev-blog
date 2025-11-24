'use client';

import { getUtterance } from '@/features/postViewer/domain/lib/tts';
import { nextPage } from '@/lib/redux/post/postViewerSlice';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function useTTSPlayer({ isPlaying }: { isPlaying: boolean }) {
  const dispatch = useDispatch<AppDispatch>();
  const { currentPageIndex, isViewerMode } = useSelector((state: RootState) => {
    return state.postViewer;
  });
  const isSpeakingRef = useRef<boolean>(false);
  const isPausedRef = useRef<boolean>(false);
  const [elements, setElements] = useState<HTMLElement[]>([]);
  const currentPageRef = useRef<number | null>(null);
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
    if (currentPageRef.current !== currentPageIndex) {
      speechSynthesis.cancel();
      clearHighlight();
      isSpeakingRef.current = false;
      isPausedRef.current = false;
      currentPageRef.current = currentPageIndex;

      const timer = setTimeout(() => {
        const container = document.querySelector('[data-viewer-container]');
        if (!container) return;
        const newElements = (
          Array.from(container.children) as HTMLElement[]
        ).filter(element => element.textContent.trim().length > 0);
        setElements(newElements);
        setElementIndex(0);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [clearHighlight, currentPageIndex]);

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
