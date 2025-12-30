'use client';

import SeriesFormDialog from '@/components/series/seriesFormDialog';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ApiError } from '@/errors/errors';
import * as PostClientService from '@/features/post/domain/service/postClientService';
import { PostProps } from '@/features/post/ui/postProps';
import useSeriesList from '@/features/series/domain/hooks/useSeriesList';
import { postKeys, userKeys } from '@/queries/keys';
import { useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { Check, ChevronsUpDown, Loader2, X } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

export default function SeriesSettingsDialog({
  userId,
  post,
  isOpen,
  setIsOpen,
}: {
  userId: string;
  post: PostProps;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const queryClient = useQueryClient();

  const [isLoading, setIsLoading] = useState(false);
  const [selectedSeriesId, setSelectedSeriesId] = useState<
    string | null | undefined
  >(post.seriesId ?? undefined);
  const [open, setOpen] = useState(false);
  const [isCreateSeriesOpen, setIsCreateSeriesOpen] = useState(false);

  const { seriesList } = useSeriesList(userId);
  const selectedSeries = useMemo(
    () => seriesList?.find(s => s.id === selectedSeriesId),
    [selectedSeriesId, seriesList]
  );

  const handleSave = useCallback(async () => {
    setIsLoading(true);

    try {
      await PostClientService.updatePost({
        postId: post.id,
        seriesId: selectedSeriesId,
        seriesOrder: selectedSeries?.postCount,
      });

      setIsOpen(false);

      queryClient.invalidateQueries({ queryKey: userKeys.seriesList(userId) });
      queryClient.invalidateQueries({ queryKey: postKeys.detail(post.id) });
      queryClient.invalidateQueries({ queryKey: userKeys.posts(userId) });
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : '시리즈에 게시글을 추가하는 데에 실패했습니다';

      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [
    post.id,
    queryClient,
    selectedSeries?.postCount,
    selectedSeriesId,
    setIsOpen,
    userId,
  ]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent showCloseButton={false} className='gap-0 rounded-sm'>
        <DialogTitle className='sr-only'>시리즈 설정 다이어로그</DialogTitle>
        <DialogDescription className='sr-only'>
          게시글을 시리즈에 추가하거나 제거할 수 있습니다
        </DialogDescription>

        <div className='text-xl font-bold mt-2 mb-1'>시리즈 설정</div>
        <div className='text-sm text-gray-500 mb-6'>
          게시글을 시리즈에 추가하거나 제거할 수 있습니다
        </div>

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              className={clsx(
                'w-full flex justify-between items-center border p-3 mb-8 rounded-sm outline-none',
                'border-gray-200 hover:border-blue-500',
                selectedSeries ? 'bg-white' : 'bg-gray-50'
              )}
            >
              <span
                className={selectedSeries ? 'text-gray-900' : 'text-gray-400'}
              >
                {selectedSeriesId === undefined
                  ? '시리즈를 선택하세요'
                  : selectedSeriesId === null
                  ? '시리즈 없음'
                  : selectedSeries?.title}
              </span>

              <div className='flex items-center gap-2'>
                {selectedSeriesId && (
                  <div className='relative h-4 w-4 shrink-0 group cursor-pointer'>
                    <div className='absolute inset-0 bg-gray-400 group-hover:bg-gray-600 rounded-full transition-colors' />
                    <X
                      className='relative h-3 w-3 text-white stroke-[2.5] m-0.5'
                      onClick={e => {
                        e.stopPropagation();
                        setSelectedSeriesId(null);
                      }}
                    />
                  </div>
                )}
                <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
              </div>
            </button>
          </PopoverTrigger>

          <PopoverContent className='w-(--radix-popover-trigger-width) p-0 rounded-sm'>
            <Command>
              {seriesList === undefined ? (
                <div className='p-3 flex justify-center'>
                  <Loader2
                    size={18}
                    strokeWidth={3}
                    className='animate-spin text-gray-400'
                  />
                </div>
              ) : (
                <>
                  <CommandEmpty>시리즈가 없습니다.</CommandEmpty>
                  {seriesList.length > 0 && (
                    <CommandGroup>
                      {seriesList.map(({ id, title }) => (
                        <CommandItem
                          key={id}
                          value={title}
                          onSelect={() => {
                            setSelectedSeriesId(id);
                            setOpen(false);
                          }}
                          className='flex justify-between px-3 py-2 gap-1 cursor-pointer'
                        >
                          <span>{title}</span>
                          {selectedSeriesId === id && (
                            <Check className='h-4 w-4 text-blue-600 -mr-1' />
                          )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}

                  <div className='border-t border-gray-100' />
                  <CommandGroup>
                    <CommandItem
                      onSelect={() => {
                        setOpen(false);
                        setIsCreateSeriesOpen(true);
                      }}
                      className='flex items-center px-3 py-2 gap-2 cursor-pointer text-blue-600 data-[selected=true]:text-blue-600'
                    >
                      <span>+ 새 시리즈 만들기</span>
                    </CommandItem>
                  </CommandGroup>
                </>
              )}
            </Command>
          </PopoverContent>
        </Popover>

        <div className='flex justify-between items-center'>
          <button
            className={clsx(
              'flex justify-center items-center px-6 h-10 rounded-sm font-bold text-white',
              isLoading ? 'bg-blue-500' : 'bg-blue-600 hover:bg-blue-500'
            )}
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 size={18} strokeWidth={3} className='animate-spin' />
            ) : (
              <div className='shrink-0'>확인</div>
            )}
          </button>
          <DialogClose asChild>
            <X className='w-10 h-10 p-2 cursor-pointer' />
          </DialogClose>
        </div>
      </DialogContent>

      <SeriesFormDialog
        mode='create'
        userId={userId}
        isOpen={isCreateSeriesOpen}
        setIsOpen={setIsCreateSeriesOpen}
        onSuccess={seriesId => setSelectedSeriesId(seriesId)}
      />
    </Dialog>
  );
}
