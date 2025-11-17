'use client';

import { getUtterance } from '@/features/postViewer/domain/lib/tts';
import { useCallback, useRef } from 'react';

export default function useTTSPlayer({
  onFinishElement,
  onFinishPage,
}: {
  onFinishElement: (nextElementIndex: number) => void;
  onFinishPage: () => void;
}) {
  const isPaused = useRef<boolean | null>(null);

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

  const startReading = useCallback(
    (elementIndex: number) => {
      const elements = getElements();
      if (!elements) return;

      if (elementIndex >= elements.length) {
        onFinishPage();
        return;
      }

      addHighlight(elementIndex);

      if (isPaused.current) {
        speechSynthesis.resume();
        isPaused.current = false;
        return;
      }

      const element = elements[elementIndex];
      const utterance = getUtterance(element.textContent);
      utterance.onend = () => {
        onFinishElement(elementIndex + 1);
      };

      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
      isPaused.current = false;
    },
    [addHighlight, getElements, onFinishElement, onFinishPage]
  );

  const pauseReading = useCallback(() => {
    speechSynthesis.pause();
    clearHighlight();

    if (isPaused.current === false) {
      isPaused.current = true;
    }
  }, [clearHighlight]);

  const stopReading = useCallback(() => {
    speechSynthesis.cancel();
    clearHighlight();
  }, [clearHighlight]);

  return { startReading, pauseReading, stopReading } as const;
}
