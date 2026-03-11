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
  onSelectDraft,
  onDeleteDraft,
}: {
  currentDraftId: string | null;
  drafts: DraftDto[] | undefined;
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
  onSelectDraft: (draftId: string) => void;
  onDeleteDraft: (draftId: string) => void;
}) {
  useScrollLock({ isLocked: isVisible });

  useEffect(() => {
    setIsVisible(false);
  }, [setIsVisible]);

  return (
    <Sidebar
      isVisible={isVisible}
      onClose={() => setIsVisible(false)}
      className='py-1.5'
    >
      {drafts && drafts.length > 0 && (
        <DraftSidebarNav
          drafts={drafts}
          currentDraftId={currentDraftId}
          onSelectDraft={draftId => {
            onSelectDraft(draftId);
            setIsVisible(false);
          }}
          onDeleteDraft={onDeleteDraft}
        />
      )}
    </Sidebar>
  );
}
