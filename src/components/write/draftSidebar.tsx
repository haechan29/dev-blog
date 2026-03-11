'use client';

import Sidebar from '@/components/sidebar';
import DraftSidebarNav from '@/components/write/draftSidebarNav';
import { DraftDto } from '@/features/draft/data/dto/draftDto';
import useScrollLock from '@/hooks/useScrollLock';
import { useEffect } from 'react';

export default function DraftSidebar({
  currentDraftId,
  drafts,
  isVisible,
  setIsVisible,
  onDraftSelect,
}: {
  currentDraftId: string | null;
  drafts: DraftDto[] | undefined;
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
  onDraftSelect: (draftId: string) => void;
}) {
  useScrollLock({ isLocked: isVisible });

  useEffect(() => {
    setIsVisible(false);
  }, [setIsVisible]);

  return (
    <Sidebar isVisible={isVisible} onClose={() => setIsVisible(false)}>
      {drafts && drafts.length > 0 && (
        <DraftSidebarNav
          drafts={drafts}
          currentDraftId={currentDraftId}
          onSelect={draftId => {
            onDraftSelect(draftId);
            setIsVisible(false);
          }}
        />
      )}
    </Sidebar>
  );
}
