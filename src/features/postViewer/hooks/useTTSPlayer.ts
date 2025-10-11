'use client';

import { getUtterance } from '@/features/postViewer/domain/lib/tts';
import { Page } from '@/features/postViewer/domain/types/page';
import { useCallback, useRef } from 'react';

export default function useTTSPlayer({
  readablePage,
  onFinishElement,
  onFinishPage,
}: {
  readablePage: Page | null;
  onFinishElement: (nextElementIndex: number) => void;
  onFinishPage: () => void;
}) {
  const isPaused = useRef<boolean | null>(null);

  const startReading = useCallback(
    (elementIndex: number) => {
      if (!readablePage) return;

      if (isPaused.current) {
        speechSynthesis.resume();
        isPaused.current = false;
        return;
      }

      if (elementIndex >= readablePage.length) {
        onFinishPage();
        return;
      }

      readablePage.forEach((element, index) => {
        element.classList.remove('tts-reading-active', 'tts-reading-inactive');

        if (index === elementIndex) {
          element.classList.add('tts-reading-active');
        } else {
          element.classList.add('tts-reading-inactive');
        }
      });

      const element = readablePage[elementIndex];
      const utterance = getUtterance(element.textContent);
      utterance.onend = () => onFinishElement(elementIndex + 1);

      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
      isPaused.current = false;
    },
    [onFinishElement, onFinishPage, readablePage]
  );

  const pauseReading = useCallback(() => {
    speechSynthesis.pause();
    if (isPaused.current === false) {
      isPaused.current = true;
    }
  }, []);

  const stopReading = useCallback(() => {
    speechSynthesis.cancel();

    if (readablePage) {
      readablePage.forEach(element => {
        element.classList.remove('tts-reading-active', 'tts-reading-inactive');
      });
    }
  }, [readablePage]);

  return { startReading, pauseReading, stopReading } as const;
}
