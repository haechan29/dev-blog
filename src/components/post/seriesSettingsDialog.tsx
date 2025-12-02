'use client';

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
import { PostProps } from '@/features/post/ui/postProps';
import useSeries from '@/features/series/domain/hooks/useSeries';
import clsx from 'clsx';
import { Check, ChevronsUpDown, Loader2, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

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
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSeriesId, setSelectedSeriesId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const { seriesList } = useSeries(userId);
  const selectedSeries = useMemo(
    () => seriesList?.find(s => s.id === selectedSeriesId) ?? null,
    [selectedSeriesId, seriesList]
  );

  const handleSave = useCallback(async () => {
    setIsLoading(true);
    // TODO: API 연동
    console.log('저장:', { postId: post.id, seriesId: selectedSeriesId });

    // 가짜 딜레이
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsLoading(false);
    setIsOpen(false);
  }, [post.id, selectedSeriesId, setIsOpen]);

  useEffect(() => {
    if (!isOpen) {
      setSelectedSeriesId(null);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent showCloseButton={false} className='gap-0 rounded-sm'>
        <DialogTitle className='sr-only'>시리즈 설정 다이어로그</DialogTitle>
        <DialogDescription className='sr-only'>
          게시글을 시리즈에 추가하거나 제거할 수 있습니다.
        </DialogDescription>

        <div className='text-xl font-bold mt-2 mb-1'>시리즈 설정</div>
        <div className='text-sm text-gray-500 mb-6'>
          이 게시글을 시리즈에 추가하거나 제거할 수 있습니다.
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
                {selectedSeries?.title ?? '시리즈를 선택하세요'}
              </span>
              <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
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
                          className='flex justify-between px-3 py-2 gap-1'
                        >
                          <span>{title}</span>
                          {selectedSeriesId === id && (
                            <Check className='h-4 w-4 text-blue-600 -mr-1' />
                          )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
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
              <div className='shrink-0'>저장</div>
            )}
          </button>
          <DialogClose asChild>
            <X className='w-10 h-10 p-2 cursor-pointer' />
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
