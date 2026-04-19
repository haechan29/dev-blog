'use client';

import InquiryThreadPreview from '@/components/contact/inquiryThreadPreview';
import * as InquiryClientRepository from '@/features/inquiry/data/repository/inquiryClientRepository';
import { InquiryCursor } from '@/features/inquiry/domain/types/page';
import { toDto } from '@/features/inquiry/ui/mapper/inquiryThreadMapper';
import { InquiryThreadProps } from '@/features/inquiry/ui/model/inquiryThreadProps';
import { inquiryKeys } from '@/queries/keys';
import { useInfiniteQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { Loader2, Plus } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';

export default function ContactPageClient({
  initialThreads,
  initialCursor,
}: {
  initialThreads: InquiryThreadProps[];
  initialCursor: InquiryCursor | null;
}) {
  const { ref, inView } = useInView();

  const {
    data: { pages },
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: inquiryKeys.threads(),
    queryFn: ({ pageParam }) =>
      InquiryClientRepository.getInquiryThreads({ cursor: pageParam }).then(
        page => {
          return {
            ...page,
            threads: page.threads.map(toDto),
          };
        }
      ),
    initialPageParam: null as InquiryCursor | null,
    getNextPageParam: lastPage => lastPage.nextCursor,
    initialData: {
      pages: [{ threads: initialThreads, nextCursor: initialCursor }],
      pageParams: [null],
    },
  });

  const threads = useMemo(() => pages.flatMap(page => page.threads), [pages]);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className='flex flex-col gap-8 pt-4 pb-20'>
      <div className='h-10 flex items-center justify-between gap-3'>
        <div className='text-lg font-semibold min-w-0'>문의 내역</div>
        <Link
          href='/contact/new'
          className={clsx(
            'flex shrink-0 items-center gap-1.5 rounded-xl px-4 py-2',
            'bg-gray-100 text-sm font-medium text-gray-600 transition-colors',
            'hover:bg-gray-200 hover:text-gray-700'
          )}
        >
          <Plus className='h-4 w-4' />
          문의하기
        </Link>
      </div>

      {threads.length === 0 ? (
        <div className='text-center py-20 text-gray-500'>
          문의 내역이 없습니다.
        </div>
      ) : (
        <div className='flex flex-col'>
          {threads.map((thread, index) => (
            <div key={thread.id} className='mb-8'>
              <InquiryThreadPreview thread={thread} />

              {index !== threads.length - 1 && (
                <div className='h-px bg-gray-200' />
              )}
            </div>
          ))}
        </div>
      )}

      <div ref={ref} />

      {isFetchingNextPage && (
        <div className='flex justify-center py-4'>
          <Loader2 strokeWidth={3} className='animate-spin text-gray-400' />
        </div>
      )}
    </div>
  );
}
