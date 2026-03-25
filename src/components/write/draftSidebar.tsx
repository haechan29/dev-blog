'use client';

import Sidebar from '@/components/sidebar';
import DraftSidebarNav from '@/components/write/draftSidebarNav';
import { DraftDto } from '@/features/draft/data/dto/draftDto';
import useScrollLock from '@/hooks/useScrollLock';
import { Menu } from 'lucide-react';
import { useEffect } from 'react';

export default function DraftSidebar({
  currentDraftId,
  drafts,
  isOpen,
  onClose,
  onSelectDraft,
  onDeleteDraft,
}: {
  currentDraftId: string | null;
  drafts: DraftDto[] | undefined;
  isOpen: boolean;
  onClose: () => void;
  onSelectDraft: (draftId: string) => void;
  onDeleteDraft: (draftId: string) => void;
}) {
  useScrollLock({ isLocked: isOpen });

  useEffect(() => {
    onClose();
  }, [onClose]);

  return (
    <Sidebar isOpen={isOpen} onClose={onClose}>
      <div className='xl:hidden pt-1.5'>
        <div className='flex items-center gap-2 md:gap-3 py-2 md:py-3'>
          <button
            onClick={onClose}
            className='shrink-0 p-2 -m-2 items-center justify-center'
            aria-label='메뉴 닫기'
          >
            <Menu className='w-6 h-6 text-gray-500' />
          </button>
        </div>
      </div>

      {drafts && drafts.length > 0 && (
        <DraftSidebarNav
          drafts={drafts}
          currentDraftId={currentDraftId}
          onSelectDraft={draftId => {
            onSelectDraft(draftId);
            onClose();
          }}
          onDeleteDraft={onDeleteDraft}
        />
      )}
    </Sidebar>
  );
}
