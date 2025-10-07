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

      page.forEach((element, index) => {
        element.classList.remove('tts-reading-active', 'tts-reading-inactive');

        if (index === elementIndex) {
          element.classList.add('tts-reading-active');
        } else {
          element.classList.add('tts-reading-inactive');
        }
      });

      const element = page[elementIndex];
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

    if (page) {
      page.forEach(element => {
        element.classList.remove('tts-reading-active', 'tts-reading-inactive');
      });
    }
  }, [page]);

  return { startReading, pauseReading, stopReading } as const;
}
