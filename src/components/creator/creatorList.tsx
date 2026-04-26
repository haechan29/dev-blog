'use client';

import { CreatorSettingsDropdown } from '@/components/creator/creatorSettingsDropdown';
import { CreatorStatusFilter } from '@/components/creator/creatorStatusFilter';
import { CreatorStatusFilter as CreatorStatusFilterType } from '@/features/creator/domain/type/creatorStatusFilter';
import { CREATOR_STATUS_FILTER_CONFIG } from '@/features/creator/ui/constants/creatorStatusConfig';
import { CreatorProps } from '@/features/creator/ui/props/creatorProps';
import clsx from 'clsx';
import { MoreVertical, Plus, RefreshCw, SlidersHorizontal } from 'lucide-react';
import { useMemo, useState } from 'react';
import SimpleBar from 'simplebar-react';

export function CreatorList({
  creators,
  selectedId,
  unreadCounts,
  onSelect,
  onCreate,
  onEdit,
  onDelete,
  onSync,
  isSyncing,
}: {
  creators: CreatorProps[];
  selectedId: string | null;
  unreadCounts: Record<string, number>;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onSync: () => void;
  isSyncing: boolean;
}) {
  const [statusFilter, setStatusFilter] =
    useState<CreatorStatusFilterType>('all');

  const filtered = useMemo(() => {
    return creators.filter(c => {
      return statusFilter === 'all' || c.status === statusFilter;
    });
  }, [creators, statusFilter]);

  const hideLabel = useMemo(() => statusFilter === 'all', [statusFilter]);
  const currentLabel = useMemo(
    () => CREATOR_STATUS_FILTER_CONFIG[statusFilter].label,
    [statusFilter]
  );

  return (
    <aside className='fixed top-0 left-0 w-(--sidebar-width) h-screen overflow-hidden border-gray-200 flex flex-col'>
      <div className='px-4 py-3 flex items-center justify-between'>
        <span className='font-semibold text-gray-900'>크리에이터</span>

        <div className='flex items-center gap-1'>
          <button
            onClick={onSync}
            disabled={isSyncing}
            className='p-2 rounded-sm text-gray-500 hover:bg-gray-100 disabled:opacity-50 cursor-pointer'
          >
            <RefreshCw
              className={clsx('w-4 h-4', isSyncing && 'animate-spin')}
            />
          </button>

          <CreatorStatusFilter
            value={statusFilter}
            onChange={setStatusFilter}
            creators={creators}
          >
            <button
              className={clsx(
                'flex items-center gap-1 p-2 rounded-sm cursor-pointer',
                statusFilter === 'all'
                  ? 'text-gray-500 hover:bg-gray-100'
                  : 'text-blue-500 hover:bg-blue-50'
              )}
            >
              <SlidersHorizontal className='w-4 h-4' />
              {!hideLabel && <span className='text-sm'>{currentLabel}</span>}
            </button>
          </CreatorStatusFilter>

          <button
            onClick={onCreate}
            className='p-2 rounded-sm text-gray-500 hover:bg-gray-100 cursor-pointer'
          >
            <Plus className='w-4 h-4' />
          </button>
        </div>
      </div>

      <SimpleBar className='flex-1 min-h-0 simplebar-hover'>
        <ul className='px-4 pb-4'>
          {filtered.map(creator => (
            <li
              key={creator.id}
              onClick={() => onSelect(creator.id)}
              className={clsx(
                'flex justify-between items-center p-3 rounded-sm cursor-pointer',
                selectedId === creator.id
                  ? 'bg-blue-50 text-blue-500'
                  : creator.status === 'rejected'
                    ? 'text-gray-400 hover:text-blue-500'
                    : 'text-gray-900 hover:text-blue-500'
              )}
            >
              <div className='flex items-center gap-2'>
                <div
                  className={clsx(
                    'text-sm',
                    selectedId === creator.id && 'font-semibold',
                    unreadCounts[creator.id] > 0 &&
                      selectedId !== creator.id &&
                      'font-medium'
                  )}
                >
                  {creator.channelName}
                </div>
                {unreadCounts[creator.id] > 0 && (
                  <span className='w-1.5 h-1.5 rounded-full bg-blue-500' />
                )}
              </div>

              {selectedId === creator.id && (
                <CreatorSettingsDropdown
                  onEdit={() => onEdit(creator.id)}
                  onDelete={() => onDelete(creator.id)}
                >
                  <button
                    onClick={e => e.stopPropagation()}
                    className='p-2 -m-2 rounded-full hover:bg-gray-200 cursor-pointer'
                  >
                    <MoreVertical className='w-5 h-5 text-gray-400' />
                  </button>
                </CreatorSettingsDropdown>
              )}
            </li>
          ))}
        </ul>
      </SimpleBar>
    </aside>
  );
}
