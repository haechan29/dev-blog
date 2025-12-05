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
import { SeriesProps } from '@/features/series/ui/seriesProps';
import { Check, Loader2, X } from 'lucide-react';
import { useMemo, useState } from 'react';

export default function AddPostDialog({
  series,
  isOpen,
  setIsOpen,
}: {
  series: SeriesProps;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);

  // TODO: 사용자의 글 목록 조회
  const posts = [
    { id: '1', title: '첫 번째 글입니다' },
    { id: '2', title: '두 번째 글입니다' },
    { id: '3', title: '세 번째 글입니다' },
    { id: '4', title: '네 번째 글입니다' },
    { id: '5', title: '다섯 번째 글입니다' },
    { id: '6', title: '여섯 번째 글입니다' },
    { id: '7', title: '일곱 번째 글입니다' },
    { id: '8', title: '여덟 번째 글입니다' },
    { id: '9', title: '아홉 번째 글입니다' },
    { id: '10', title: '열 번째 글입니다' },
    { id: '11', title: '열한 번째 글입니다' },
    { id: '12', title: '열두 번째 글입니다' },
  ];

  const existingPostIds = useMemo(() => {
    return series.posts.map(post => post.id);
  }, [series.posts]);

  const handleSelect = async (postId: string) => {
    if (existingPostIds.includes(postId)) return;

    setIsLoading(true);
    try {
      // API 호출
      console.log(postId);
      setIsOpen(false);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

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
          {posts === undefined ? (
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
              {posts.length > 0 && (
                <CommandGroup className='overflow-y-auto'>
                  {posts.map(post => {
                    const isAdded = existingPostIds.includes(post.id);
                    return (
                      <CommandItem
                        key={post.id}
                        value={post.title}
                        onSelect={() => handleSelect(post.id)}
                        disabled={isAdded || isLoading}
                        className='flex justify-between px-3 py-2 gap-1'
                      >
                        <span className={isAdded ? 'text-gray-400' : ''}>
                          {post.title}
                        </span>
                        {isAdded && <Check className='h-4 w-4 text-gray-400' />}
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
