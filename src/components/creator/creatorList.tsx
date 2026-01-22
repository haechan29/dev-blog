'use client';

import { CreatorSettingsDropdown } from '@/components/creator/creatorSettingsDropdown';
import {
  Creator,
  CREATOR_STATUS_LABELS,
  CreatorStatus,
} from '@/features/creator/domain/model/creator';
import clsx from 'clsx';
import { MoreVertical } from 'lucide-react';
import { useState } from 'react';

export function CreatorList({
  creators,
  selectedId,
  onSelect,
  onCreate,
  onEdit,
  onDelete,
}: {
  creators: Creator[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<CreatorStatus | 'all'>(
    'all'
  );

  const filtered = creators.filter(c => {
    const matchesSearch = c.channelName
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <aside className='w-[300px] border-r flex flex-col'>
      <div className='p-3 border-b space-y-2'>
        <input
          type='text'
          placeholder='검색...'
          value={search}
          onChange={e => setSearch(e.target.value)}
          className='w-full px-3 py-2 border rounded'
        />
        <select
          value={statusFilter}
          onChange={e =>
            setStatusFilter(e.target.value as CreatorStatus | 'all')
          }
          className='w-full px-3 py-2 border rounded'
        >
          <option value='all'>전체</option>
          <option value='pending'>대기</option>
          <option value='sent'>발송됨</option>
          <option value='accepted'>수락</option>
          <option value='rejected'>거절</option>
        </select>
        <button
          onClick={onCreate}
          className='w-full py-2 bg-blue-500 text-white rounded'
        >
          + 크리에이터 등록
        </button>
      </div>

      <ul className='flex-1 overflow-y-auto'>
        {filtered.map(creator => (
          <li
            key={creator.id}
            onClick={() => onSelect(creator.id)}
            className={clsx(
              'flex justify-between items-center p-3 cursor-pointer border-b',
              selectedId === creator.id ? 'bg-blue-50' : 'hover:bg-gray-50'
            )}
          >
            <div>
              <div className='font-medium'>{creator.channelName}</div>
              <div className='text-sm text-gray-500'>
                {CREATOR_STATUS_LABELS[creator.status]}
              </div>
            </div>

            <CreatorSettingsDropdown
              onEdit={() => onEdit(creator.id)}
              onDelete={() => onDelete(creator.id)}
            >
              <button
                onClick={e => e.stopPropagation()}
                className='p-2 -m-2 hover:bg-gray-200 rounded-full cursor-pointer'
              >
                <MoreVertical className='w-5 h-5 text-gray-400' />
              </button>
            </CreatorSettingsDropdown>
          </li>
        ))}
      </ul>
    </aside>
  );
}
