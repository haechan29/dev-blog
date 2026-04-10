'use client';

import type { InquiryThreadDto } from '@/features/inquiry/data/dto/inquiryThreadDto';
import * as InquiryClientRepository from '@/features/inquiry/data/repository/inquiryClientRepository';
import type { InquiryThreadStatus } from '@/features/inquiry/domain/types/inquiryThreadStatus';
import type { InquiryCursor } from '@/features/inquiry/domain/types/page';
import { formatDate } from '@/features/post/domain/lib/date';
import { inquiryKeys } from '@/queries/keys';
import { useInfiniteQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import {
  Archive,
  CircleCheck,
  Clock,
  Loader2,
  MessageSquarePlus,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';

function statusIcon(status: InquiryThreadStatus) {
  switch (status) {
    case 'AWAITING_REPLY':
      return <Clock className='w-5 h-5 text-amber-500' />;
    case 'ANSWERED':
      return <CircleCheck className='w-5 h-5 text-emerald-500' />;
    case 'CLOSED':
      return <Archive className='w-5 h-5 text-gray-400' />;
  }
}

function firstLineText(thread: InquiryThreadDto) {
  return thread.firstMessagePreview ?? '(문의 내용 없음)';
}

function secondLineText(thread: InquiryThreadDto) {
  return thread.lastMessagePreview ?? '아직 답변이 없습니다.';
}

export default function ContactPageClient({
  initialThreads,
  initialCursor,
}: {
  initialThreads: InquiryThreadDto[];
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
      InquiryClientRepository.getMyInquiryThreads({ cursor: pageParam }),
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
    <div
      className={clsx(
        'mt-(--toolbar-height) mb-8 px-6 md:px-12 xl:px-18',
        'xl:ml-(--sidebar-width)',
        'xl:mr-[calc(var(--toc-width)+var(--toc-margin))]'
      )}
    >
      <div className='flex flex-col pt-8 pb-20'>
        <div className='flex justify-end mb-8'>
          <Link
            href='/contact/new'
            className={clsx(
              'flex shrink-0 items-center justify-center gap-2 self-start sm:self-auto',
              'px-6 py-3 rounded-xl text-gray-600 hover:text-gray-700 font-medium',
              'bg-gray-100 hover:bg-gray-200 transition-colors'
            )}
          >
            <MessageSquarePlus className='w-5 h-5' strokeWidth={2} />
            문의하기
          </Link>
        </div>

        <section aria-labelledby='inquiry-history-heading'>
          <h2
            id='inquiry-history-heading'
            className='text-lg font-semibold mb-4'
          >
            내 문의 내역
          </h2>

          {threads.length === 0 ? (
            <div className='text-center py-20 text-gray-500'>
              아직 문의 내역이 없습니다.
            </div>
          ) : (
            <div className='flex flex-col'>
              {threads.map((thread, index) => (
                <div key={thread.id} className='mb-8'>
                  <Link
                    href={`/contact/${thread.id}`}
                    className='flex gap-3 rounded-lg -mx-1 px-1 py-1 -my-1 hover:bg-gray-50 transition-colors text-left'
                  >
                    <div className='relative shrink-0 pt-0.5'>
                      {statusIcon(thread.status)}
                      {thread.userUnreadCount > 0 && (
                        <span className='absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-red-500 ring-2 ring-white' />
                      )}
                    </div>

                    <div className='flex-1 min-w-0'>
                      <div className='flex items-baseline justify-between gap-3'>
                        <p className='text-[15px] font-semibold text-gray-900 leading-snug line-clamp-1'>
                          {firstLineText(thread)}
                        </p>
                        <span className='shrink-0 text-xs text-gray-500'>
                          {formatDate(thread.updatedAt)}
                        </span>
                      </div>
                      <p className='mt-1 text-sm text-gray-600 leading-snug line-clamp-2'>
                        {secondLineText(thread)}
                      </p>
                    </div>
                  </Link>
                  {index !== threads.length - 1 && (
                    <div className='mt-8 h-px bg-gray-200' />
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
        </section>
      </div>
    </div>
  );
}
