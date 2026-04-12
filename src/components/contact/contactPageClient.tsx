'use client';

import ContactToolbar from '@/components/contact/contactToolbar';
import * as InquiryClientRepository from '@/features/inquiry/data/repository/inquiryClientRepository';
import { InquiryThreadStatus } from '@/features/inquiry/domain/types/inquiryThreadStatus';
import { InquiryCursor } from '@/features/inquiry/domain/types/page';
import { toDto } from '@/features/inquiry/ui/mapper/inquiryThreadMapper';
import { InquiryThreadProps } from '@/features/inquiry/ui/model/inquiryThreadProps';
import { formatDate } from '@/features/post/domain/lib/date';
import { inquiryKeys } from '@/queries/keys';
import { useInfiniteQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { Archive, CircleCheck, Clock, Loader2, Plus } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
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

function InquiryThreadPreview({ thread }: { thread: InquiryThreadProps }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className='relative flex flex-col mb-8'>
      <div
        className={clsx(
          'absolute -inset-x-6 -inset-y-4 -z-50 rounded-xl bg-gray-100/50',
          'origin-center transition duration-300 ease-in-out',
          isHovered ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
        )}
      />

      <div
        onMouseLeave={() => setIsHovered(false)}
        className='w-full flex flex-col'
      >
        <Link
          href={`/contact/${thread.id}`}
          className='w-full flex gap-4 text-left text-gray-900'
          onMouseEnter={() => setIsHovered(true)}
        >
          <div className='relative shrink-0 pt-1'>
            {statusIcon(thread.status)}
            {thread.userUnreadCount > 0 && (
              <span className='absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-red-500 ring-2 ring-white' />
            )}
          </div>

          <div className='flex min-w-0 flex-1 flex-col gap-2'>
            <div className='flex justify-between gap-3'>
              <p
                className={clsx(
                  'line-clamp-1 text-lg sm:text-xl font-semibold text-gray-900'
                )}
              >
                {thread.firstLineText}
              </p>
              <span className='shrink-0 text-xs text-gray-500'>
                {formatDate(thread.updatedAt)}
              </span>
            </div>

            <p className='text-sm text-gray-500 line-clamp-2'>
              {thread.secondLineText}
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default function ContactPageClient({
  isLoggedIn,
  initialThreads,
  initialCursor,
}: {
  isLoggedIn: boolean;
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
      InquiryClientRepository.getMyInquiryThreads({ cursor: pageParam }).then(
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
    <>
      <ContactToolbar isLoggedIn={isLoggedIn} />

      <div
        className={clsx(
          'mt-(--toolbar-height) mb-8 px-6 md:px-12 xl:px-18',
          'xl:ml-(--sidebar-width)',
          'xl:mr-[calc(var(--toc-width)+var(--toc-margin))]'
        )}
      >
        <div className='flex flex-col gap-8 pt-4 pb-20'>
          <div className='flex items-center justify-between gap-3'>
            <h2 className='text-lg font-semibold min-w-0'>문의 내역</h2>
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
      </div>
    </>
  );
}
