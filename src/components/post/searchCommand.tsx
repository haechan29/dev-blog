'use client';

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
import * as PostClientService from '@/features/post/domain/service/postClientService';
import { createProps } from '@/features/post/ui/postProps';
import useDebounce from '@/hooks/useDebounce';
import { useQuery } from '@tanstack/react-query';
import { Command as CommandPrimitive } from 'cmdk';
import { Loader2, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SearchCommand() {
  const router = useRouter();
  const debounce = useDebounce();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['searchPosts', debouncedQuery],
    queryFn: () =>
      PostClientService.searchPosts(debouncedQuery).then(posts =>
        posts.map(createProps)
      ),
    enabled: debouncedQuery.length > 0,
  });

  const shouldShowDropdown = isDropdownOpen && query.length > 0;

  useEffect(() => {
    debounce(() => setDebouncedQuery(query), 300);
  }, [query, debounce]);

  return (
    <Command className='relative' shouldFilter={false}>
      <Popover open={shouldShowDropdown} onOpenChange={setIsDropdownOpen}>
        <PopoverAnchor asChild>
          <div className='flex items-center px-4 py-2 border border-gray-200 rounded-full hover:border-blue-500 focus-within:border-blue-500'>
            <CommandPrimitive.Input
              placeholder='검색'
              value={query}
              onValueChange={setQuery}
              onFocus={() => setIsDropdownOpen(true)}
              onKeyDown={e => {
                if (e.key === 'Enter' && query.trim()) {
                  router.push(`/search?q=${encodeURIComponent(query.trim())}`);
                }
              }}
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
            {isLoading ? (
              <div className='py-6 flex justify-center'>
                <Loader2
                  strokeWidth={3}
                  className='w-5 h-5 animate-spin text-gray-400'
                />
              </div>
            ) : posts.length === 0 ? (
              <CommandEmpty>검색 결과가 없습니다</CommandEmpty>
            ) : (
              <CommandGroup>
                {posts.map(post => (
                  <CommandItem
                    key={post.id}
                    value={post.title}
                    onSelect={() => {
                      router.push(`/read/${post.id}`);
                      setIsDropdownOpen(false);
                      setQuery('');
                    }}
                    className='px-3 py-2'
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
            )}
          </CommandList>
        </PopoverContent>
      </Popover>
    </Command>
  );
}
