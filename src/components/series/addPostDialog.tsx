'use client';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import * as PostClientService from '@/features/post/domain/service/postClientService';
import useSeriesPosts from '@/features/series/domain/hooks/useSeriesPosts';
import { SeriesProps } from '@/features/series/ui/seriesProps';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { Loader2, X } from 'lucide-react';
import { useCallback, useMemo } from 'react';

export default function AddPostDialog({
  series,
  isOpen,
  setIsOpen,
}: {
  series: SeriesProps;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const { data: posts } = useQuery({
    queryKey: ['posts', series.userId],
    queryFn: () => PostClientService.fetchPosts(series.userId),
  });

  const { posts: existingPosts, addPostMutation } = useSeriesPosts(series);
  const existingPostIds = useMemo(() => {
    return existingPosts.map(post => post.id);
  }, [existingPosts]);

  const sortedPosts = useMemo(() => {
    if (!posts) return undefined;

    return [...posts].sort((a, b) => {
      const aAdded = existingPostIds.includes(a.id);
      const bAdded = existingPostIds.includes(b.id);
      if (aAdded !== bAdded) return aAdded ? 1 : -1;

      if (a.seriesId === null && b.seriesId === null) {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      } else if (a.seriesId === null) {
        return -1;
      } else if (b.seriesId === null) {
        return 1;
      }

      return a.seriesId !== b.seriesId
        ? a.seriesId.localeCompare(b.seriesId)
        : (a.seriesOrder ?? 0) - (b.seriesOrder ?? 0);
    });
  }, [posts, existingPostIds]);

  const handleSelect = useCallback(
    (postId: string) => {
      if (!posts || existingPostIds.includes(postId)) return;

      addPostMutation.mutate(postId, {
        onSuccess: () => {
          setIsOpen(false);
        },
      });
    },
    [addPostMutation, existingPostIds, posts, setIsOpen]
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent showCloseButton={false} className='gap-0 rounded-sm'>
        <DialogTitle className='sr-only'>글 추가 다이얼로그</DialogTitle>
        <DialogDescription className='sr-only'>
          시리즈에 추가할 글을 선택하세요
        </DialogDescription>

        <div className='text-xl font-bold mt-2 mb-1'>글 추가</div>
        <div className='text-sm text-gray-500 mb-6'>
          시리즈에 추가할 글을 선택하세요
        </div>

        <Command className='border rounded-sm h-60'>
          <CommandInput placeholder='글 제목' />
          {sortedPosts === undefined ? (
            <div className='p-3 flex justify-center'>
              <Loader2
                size={18}
                strokeWidth={3}
                className='animate-spin text-gray-400'
              />
            </div>
          ) : (
            <>
              <CommandEmpty>글이 없습니다.</CommandEmpty>
              {sortedPosts.length > 0 && (
                <CommandGroup className='overflow-y-auto'>
                  {sortedPosts.map(post => {
                    const isAdded = existingPostIds.includes(post.id);
                    return (
                      <CommandItem
                        key={post.id}
                        value={post.title}
                        onSelect={() => handleSelect(post.id)}
                        className='cursor-pointer'
                      >
                        <span className={clsx(isAdded && 'text-gray-400')}>
                          {post.title}
                        </span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              )}
            </>
          )}
        </Command>

        <div className='flex justify-end mt-8'>
          <DialogClose asChild>
            <X className='w-10 h-10 p-2 cursor-pointer' />
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
