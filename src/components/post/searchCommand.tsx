'use client';

import { Command as CommandPrimitive } from 'cmdk';
import { Search } from 'lucide-react';
import { useState } from 'react';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from '@/components/ui/popover';

type Props = {
  onSelect: (postId: string) => void;
};

const MOCK_RESULTS = [
  {
    id: '1',
    title: 'React 18의 새로운 기능들',
    authorName: '김개발',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    title: 'Next.js App Router 완벽 가이드',
    authorName: '이프론트',
    createdAt: '2024-01-10',
  },
  {
    id: '3',
    title: 'TypeScript 5.0 마이그레이션',
    authorName: '박타입',
    createdAt: '2024-01-08',
  },
];

export default function SearchCommand({ onSelect }: Props) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [query, setQuery] = useState('');

  const shouldShowDropdown = isDropdownOpen && query.length > 0;

  return (
    <Command className='relative' shouldFilter={false}>
      <Popover open={shouldShowDropdown} onOpenChange={setIsDropdownOpen}>
        <PopoverAnchor asChild>
          <div className='flex items-center px-4 py-2 border border-gray-200 rounded-full'>
            <CommandPrimitive.Input
              placeholder='검색'
              value={query}
              onValueChange={setQuery}
              onFocus={() => setIsDropdownOpen(true)}
              className='flex-1 min-w-0 text-sm text-gray-900 bg-transparent outline-none placeholder:text-gray-400'
            />
            <Search className='w-5 h-5 shrink-0' />
          </div>
        </PopoverAnchor>

        <PopoverContent
          className='w-(--radix-popover-trigger-width) p-0'
          align='start'
          sideOffset={8}
          onOpenAutoFocus={e => e.preventDefault()}
        >
          <CommandList>
            <CommandEmpty>검색 결과가 없습니다</CommandEmpty>
            <CommandGroup>
              {MOCK_RESULTS.map(post => (
                <CommandItem
                  key={post.id}
                  value={post.title}
                  onSelect={() => {
                    onSelect(post.id);
                    setIsDropdownOpen(false);
                    setQuery('');
                  }}
                >
                  <div className='flex flex-col gap-1'>
                    <span className='font-medium'>{post.title}</span>
                    <span className='text-xs text-gray-500'>
                      {post.authorName} · {post.createdAt}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </PopoverContent>
      </Popover>
    </Command>
  );
}
