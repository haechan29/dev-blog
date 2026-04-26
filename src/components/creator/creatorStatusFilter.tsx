'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Creator,
  STATUS_FILTER_OPTIONS,
} from '@/features/creator/domain/model/creator';
import { CreatorStatus } from '@/features/creator/domain/type/creatorStatus';
import { Check } from 'lucide-react';
import { ReactNode } from 'react';

export function CreatorStatusFilter({
  value,
  onChange,
  creators,
  children,
}: {
  value: CreatorStatus | 'all';
  onChange: (value: CreatorStatus | 'all') => void;
  creators: Creator[];
  children: ReactNode;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>

      <DropdownMenuContent align='end'>
        {Object.entries(STATUS_FILTER_OPTIONS)
          .filter(([key]) => {
            if (key === 'all') return true;
            return creators.some(c => c.status === key);
          })
          .map(([key, { label }]) => (
            <DropdownMenuItem
              key={key}
              onClick={() => onChange(key as CreatorStatus | 'all')}
              className='flex items-center justify-between cursor-pointer'
            >
              {label}
              {value === key && <Check className='w-4 h-4 text-blue-600' />}
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
