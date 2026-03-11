'use client';

import { DraftDto } from '@/features/draft/data/dto/draftDto';
import clsx from 'clsx';
import SimpleBar from 'simplebar-react';

export default function DraftSidebarNav({
  drafts,
  currentDraftId,
  onSelect,
}: {
  drafts: DraftDto[];
  currentDraftId: string | null;
  onSelect: (draftId: string) => void;
}) {
  return (
    <SimpleBar className='flex-1 min-h-0 simplebar-hover'>
      <div className='flex flex-col flex-1'>
        {drafts.map(draft => (
          <button
            key={draft.id}
            type='button'
            onClick={() => onSelect(draft.id)}
            className={clsx(
              'flex w-full py-3 pl-3 pr-3 rounded-sm hover:text-blue-500 items-center gap-2 text-left',
              draft.id === currentDraftId
                ? 'bg-blue-50 font-semibold text-blue-500'
                : 'text-gray-900'
            )}
          >
            <div
              className={clsx(
                'text-sm truncate',
                !draft.title?.trim() && 'text-gray-400'
              )}
            >
              {draft.title?.trim() || '제목 없음'}
            </div>
          </button>
        ))}
      </div>
    </SimpleBar>
  );
}
