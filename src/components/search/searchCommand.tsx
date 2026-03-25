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
import * as TagClientRepository from '@/features/tag/data/repository/tagClientRepository';
import useDebounce from '@/hooks/useDebounce';
import useMediaQuery, { TOUCH_QUERY } from '@/hooks/useMediaQuery';
import useRouterWithProgress from '@/hooks/useRouterWithProgress';
import { postKeys, tagKeys } from '@/queries/keys';
import { useQuery } from '@tanstack/react-query';
import { Command as CommandPrimitive } from 'cmdk';
import { ArrowUpRight, Loader2, Search } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import SimpleBar from 'simplebar-react';

export default function SearchCommand({
  initialQuery,
}: {
  initialQuery?: string;
}) {
  const router = useRouterWithProgress();
  const debounce = useDebounce();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState('-');
  const isTouch = useMediaQuery(TOUCH_QUERY);

  const [query, setQuery] = useState(initialQuery ?? '');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const isTagSearch = debouncedQuery.startsWith('#');

  const postQuery = isTagSearch ? '' : debouncedQuery.trim();
  const tagQuery = isTagSearch ? debouncedQuery.slice(1).trim() : '';

  const isPostSearchEnabled = !isTagSearch && postQuery.length > 0;
  const isTagSearchEnabled = isTagSearch && tagQuery.length > 0;

  const { data: posts = [], isLoading: isPostsLoading } = useQuery({
    queryKey: postKeys.search(postQuery),
    queryFn: () =>
      PostClientService.searchPosts({ query: postQuery }).then(result =>
        result.posts.map(createProps)
      ),
    enabled: isPostSearchEnabled,
  });

  const { data: tags = [], isLoading: isTagsLoading } = useQuery({
    queryKey: tagKeys.search(tagQuery),
    queryFn: () => TagClientRepository.getTagNames({ query: tagQuery }),
    enabled: isTagSearchEnabled,
  });

  const isLoading =
    (!isTagSearch && isPostsLoading) || (isTagSearch && isTagsLoading);
  const isEmpty =
    (!isTagSearch && posts.length === 0) || (isTagSearch && tags.length === 0);
  const shouldShowDropdown = isDropdownOpen && query.length > 0;
  const isTagOnly = query === '#';

  const navigateFromSearchInput = () => {
    const isTagSearch = query.startsWith('#');
    const postQuery = isTagSearch ? '' : query.trim();
    const tagQuery = isTagSearch ? query.slice(1).trim() : '';

    if (postQuery) {
      router.push(`/search/result?q=${encodeURIComponent(postQuery)}`);
    } else if (tagQuery) {
      router.push(`/tag/${encodeURIComponent(tagQuery)}`);
    }
  };

  useEffect(() => {
    debounce(() => setDebouncedQuery(query), 300);
  }, [query, debounce]);

  return (
    <Command
      value={selectedValue}
      onValueChange={setSelectedValue}
      shouldFilter={false}
      className='relative bg-transparent'
    >
      <Popover
        open={shouldShowDropdown}
        onOpenChange={open => {
          if (!open && document.activeElement?.closest('[cmdk-input]')) return;
          setIsDropdownOpen(open);
        }}
      >
        <PopoverAnchor asChild>
          <div className='relative flex items-center px-4 py-2 border border-gray-200 rounded-full hover:border-blue-500 focus-within:border-blue-500'>
            <CommandPrimitive.Input
              placeholder='검색'
              value={query}
              onValueChange={setQuery}
              onFocus={() => setIsDropdownOpen(true)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  navigateFromSearchInput();
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
          <CommandList
            className='max-h-none overflow-hidden'
            onMouseLeave={() => setSelectedValue('-')}
          >
            {isTagOnly ? (
              <CommandEmpty>
                <div className='text-gray-400'>태그를 입력해주세요</div>
              </CommandEmpty>
            ) : isLoading ? (
              <div className='py-6 flex justify-center'>
                <Loader2
                  strokeWidth={3}
                  className='w-5 h-5 animate-spin text-gray-400'
                />
              </div>
            ) : isEmpty ? (
              <CommandEmpty>
                <div className='text-gray-400'>검색 결과가 없습니다</div>
              </CommandEmpty>
            ) : (
              <CommandGroup>
                <SimpleBar className='max-h-[310px] simplebar-hover'>
                  <CommandItem
                    value='-'
                    className='hidden'
                    aria-hidden='true'
                  />
                  {!isTagSearch &&
                    posts.map(post => (
                      <CommandItem
                        key={post.id}
                        value={`post:${post.id}`}
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
                  {isTagSearch &&
                    tags.map(tag => (
                      <CommandItem
                        key={tag}
                        value={`tag:${tag}`}
                        onSelect={() => {
                          router.push(`/tag/${encodeURIComponent(tag)}`);
                          setIsDropdownOpen(false);
                          setQuery('');
                        }}
                        className='px-3 py-2 cursor-pointer'
                      >
                        <div className='flex justify-between items-center w-full'>
                          <span className='line-clamp-1'>#{tag}</span>
                          <ArrowUpRight className='w-4 h-4 shrink-0 text-gray-400' />
                        </div>
                      </CommandItem>
                    ))}
                </SimpleBar>
              </CommandGroup>
            )}
          </CommandList>
        </PopoverContent>
      </Popover>
    </Command>
  );
}
