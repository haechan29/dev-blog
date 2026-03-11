'use client';

import Sidebar from '@/components/sidebar';
import DraftSidebarNav from '@/components/write/draftSidebarNav';
import useDrafts from '@/features/draft/hooks/useDrafts';
import useScrollLock from '@/hooks/useScrollLock';
import { useEffect } from 'react';

export default function DraftSidebar({
  currentDraftId,
  isVisible,
  setIsVisible,
  onDraftSelect,
}: {
  currentDraftId: string | null;
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
  onDraftSelect?: (draftId: string | null) => void;
}) {
  const { drafts } = useDrafts();

  useScrollLock({ isLocked: isVisible });

  useEffect(() => {
    setIsVisible(false);
  }, [setIsVisible]);

  return (
    <Sidebar isVisible={isVisible} onClose={() => setIsVisible(false)}>
      {drafts && drafts.length > 0 && (
        <DraftSidebarNav drafts={drafts} currentDraftId={currentDraftId} />
      )}
    </Sidebar>
  );
}
