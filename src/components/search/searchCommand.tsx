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
import useMediaQuery, { TOUCH_QUERY } from '@/hooks/useMediaQuery';
import useRouterWithProgress from '@/hooks/useRouterWithProgress';
import { useQuery } from '@tanstack/react-query';
import { Command as CommandPrimitive } from 'cmdk';
import { ArrowUpRight, Loader2, Search } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function SearchCommand({
  initialQuery,
}: {
  initialQuery?: string;
}) {
  const router = useRouterWithProgress();
  const debounce = useDebounce();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [query, setQuery] = useState(initialQuery ?? '');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedValue, setSelectedValue] = useState('-');
  const isTouch = useMediaQuery(TOUCH_QUERY);

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['searchPosts', debouncedQuery],
    queryFn: () =>
      PostClientService.searchPosts(debouncedQuery, 10).then(result =>
        result.posts.map(createProps)
      ),
    enabled: debouncedQuery.length > 0,
  });

  const shouldShowDropdown = isDropdownOpen && query.length > 0;

  useEffect(() => {
    debounce(() => setDebouncedQuery(query), 300);
  }, [query, debounce]);

  return (
    <Command
      value={selectedValue}
      onValueChange={setSelectedValue}
      shouldFilter={false}
      className='relative'
    >
      <Popover open={shouldShowDropdown} onOpenChange={setIsDropdownOpen}>
        <PopoverAnchor asChild>
          <div className='relative flex items-center px-4 py-2 border border-gray-200 rounded-full hover:border-blue-500 focus-within:border-blue-500'>
            <CommandPrimitive.Input
              placeholder='검색'
              value={query}
              onValueChange={setQuery}
              onFocus={() => setIsDropdownOpen(true)}
              onKeyDown={e => {
                if (e.key === 'Enter' && query.trim()) {
                  router.push(
                    `/search/result?q=${encodeURIComponent(query.trim())}`
                  );
                }
              }}
              className='flex-1 min-w-0 text-sm text-gray-900 bg-transparent outline-none placeholder:text-gray-400'
            />
            <Search className='w-5 h-5 shrink-0' />

            {isTouch && (
              <Link
                href='/search'
                aria-label='검색 페이지로 이동'
                className='absolute inset-0'
              />
            )}
          </div>
        </PopoverAnchor>

        <PopoverContent
          className='w-(--radix-popover-trigger-width) p-0'
          align='start'
          sideOffset={8}
          onOpenAutoFocus={e => e.preventDefault()}
        >
          <CommandList onMouseLeave={() => setSelectedValue('-')}>
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
                <CommandItem value='-' className='hidden' aria-hidden='true' />
                {posts.map(post => (
                  <CommandItem
                    key={post.id}
                    value={post.title}
                    onSelect={() => {
                      router.push(`/read/${post.id}`);
                      setIsDropdownOpen(false);
                      setQuery('');
                    }}
                    className='px-3 py-2 cursor-pointer'
                  >
                    <div className='flex justify-between items-center w-full'>
                      <span className='line-clamp-1'>{post.title}</span>
                      <ArrowUpRight className='w-4 h-4 shrink-0 text-gray-400' />
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
