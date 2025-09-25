'use client';

import { getUtterance } from '@/lib/tts';
import { RefObject, useCallback, useRef } from 'react';

export default function useTTSPlayer({
  pageRef,
  onFinishElement,
  onFinishPage,
}: {
  pageRef: RefObject<HTMLDivElement | null>;
  onFinishElement: (nextElementIndex: number) => void;
  onFinishPage: () => void;
}) {
  const isPaused = useRef(false);

  const startReading = useCallback(
    (elementIndex: number) => {
      if (isPaused.current) {
        speechSynthesis.resume();
        isPaused.current = false;
        return;
      }

      const page = pageRef.current;
      if (!page) return;

      const currentPageElements = page.children;
      if (elementIndex >= currentPageElements.length) {
        onFinishPage();
        return;
      }

      const element = currentPageElements[elementIndex];

      document
        .querySelectorAll('.reading-highlight')
        .forEach(el => el.classList.remove('reading-highlight'));

      element.classList.add('reading-highlight');

      const utterance = getUtterance(element.textContent);
      utterance.onend = () => onFinishElement(elementIndex + 1);

      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
    },
    [onFinishElement, onFinishPage, pageRef]
  );

  const pauseReading = useCallback(() => {
    speechSynthesis.pause();
    isPaused.current = true;
  }, []);

  const stopReading = useCallback(() => {
    speechSynthesis.cancel();

    document
      .querySelectorAll('.reading-highlight')
      .forEach(el => el.classList.remove('reading-highlight'));
  }, []);

  return { startReading, pauseReading, stopReading } as const;
}
