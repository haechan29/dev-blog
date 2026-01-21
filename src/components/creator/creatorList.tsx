'use client';

import { Creator } from '@/features/creator/domain/model/creator';
import { useState } from 'react';

type CreatorStatus = 'pending' | 'sent' | 'accepted' | 'rejected';

const STATUS_LABELS: Record<CreatorStatus, string> = {
  pending: '대기',
  sent: '발송됨',
  accepted: '수락',
  rejected: '거절',
};

export function CreatorList({
  creators,
  selectedId,
  onSelect,
}: {
  creators: Creator[];
  selectedId: string | null;
  onSelect: (id: string) => void;
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
        <button className='w-full py-2 bg-blue-500 text-white rounded'>
          + 크리에이터 등록
        </button>
      </div>

      <ul className='flex-1 overflow-y-auto'>
        {filtered.map(creator => (
          <li
            key={creator.id}
            onClick={() => onSelect(creator.id)}
            className={`p-3 cursor-pointer border-b hover:bg-gray-50 ${
              selectedId === creator.id ? 'bg-blue-50' : ''
            }`}
          >
            <div className='font-medium'>{creator.channelName}</div>
            <div className='text-sm text-gray-500'>
              {STATUS_LABELS[creator.status]}
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
