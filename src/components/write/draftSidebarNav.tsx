'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DraftDto } from '@/features/draft/data/dto/draftDto';
import clsx from 'clsx';
import { MoreVertical, Trash2 } from 'lucide-react';
import SimpleBar from 'simplebar-react';

export default function DraftSidebarNav({
  drafts,
  currentDraftId,
  onSelectDraft,
  onDeleteDraft,
}: {
  drafts: DraftDto[];
  currentDraftId: string | null;
  onSelectDraft: (draftId: string) => void;
  onDeleteDraft: (draftId: string) => void;
}) {
  return (
    <SimpleBar className='flex-1 min-h-0 simplebar-hover'>
      <div className='flex flex-col flex-1'>
        {drafts.map(draft => {
          const isSelected = draft.id === currentDraftId;

          return (
            <div
              key={draft.id}
              onClick={() => onSelectDraft(draft.id)}
              className={clsx(
                'flex w-full py-3 pl-3 pr-3 rounded-sm hover:text-blue-500 items-center gap-2 text-left cursor-pointer',
                isSelected
                  ? 'bg-blue-50 font-semibold text-blue-500'
                  : 'text-gray-900'
              )}
            >
              <div
                className={clsx(
                  'flex-1 min-w-0 text-sm truncate',
                  !draft.title?.trim() && 'text-gray-400'
                )}
              >
                {draft.title?.trim() || '제목 없음'}
              </div>

              {isSelected && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      onClick={e => e.stopPropagation()}
                      className='p-2 -m-1 rounded-full hover:bg-gray-200 cursor-pointer'
                    >
                      <MoreVertical className='w-4 h-4 text-gray-400' />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    <DropdownMenuItem
                      onClick={e => {
                        e.stopPropagation();
                        onDeleteDraft(draft.id);
                      }}
                      className='flex items-center gap-2 cursor-pointer'
                    >
                      <Trash2 className='w-4 h-4 text-red-400' />
                      <span className='text-red-600'>삭제</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          );
        })}
      </div>
    </SimpleBar>
  );
}
