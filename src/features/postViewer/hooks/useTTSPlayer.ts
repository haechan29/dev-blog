'use client';

import { getUtterance } from '@/features/postViewer/domain/lib/tts';
import { Page } from '@/features/postViewer/domain/types/page';
import { useCallback, useRef } from 'react';

export default function useTTSPlayer({
  page,
  onFinishElement,
  onFinishPage,
}: {
  page: Page | null;
  onFinishElement: (nextElementIndex: number) => void;
  onFinishPage: () => void;
}) {
  const isPaused = useRef(false);

  const startReading = useCallback(
    (elementIndex: number) => {
      if (!page) return;

      if (isPaused.current) {
        speechSynthesis.resume();
        isPaused.current = false;
        return;
      }

      if (elementIndex >= page.length) {
        onFinishPage();
        return;
      }

      const element = page[elementIndex];

      document
        .querySelectorAll('.reading-highlight')
        .forEach(el => el.classList.remove('reading-highlight'));

      element.classList.add('reading-highlight');

      const utterance = getUtterance(element.textContent);
      utterance.onend = () => onFinishElement(elementIndex + 1);

      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
    },
    [onFinishElement, onFinishPage, page]
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
