'use client';

import * as InteractionRepository from '@/features/post-interaction/data/repository/interactionRepository';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

export default function useRecordView(postId: string) {
  const searchParams = useSearchParams();
  const fromFeed = searchParams.get('from') === 'feed';
  const startTimeRef = useRef<number>(Date.now());
  const hasRecordedRef = useRef(false);

  useEffect(() => {
    const recordView = () => {
      if (!hasRecordedRef.current) {
        const readDuration = Math.floor(
          (Date.now() - startTimeRef.current) / 1000
        );
        InteractionRepository.recordView(postId, readDuration, fromFeed);
        hasRecordedRef.current = true;
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        recordView();
      }
    };

    const handlePageHide = () => {
      recordView();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', handlePageHide);

    return () => {
      recordView();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handlePageHide);
    };
  }, [postId, fromFeed]);
}
