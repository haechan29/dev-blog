'use client';

import { AdminInquiryThreadPageClient } from '@/components/contact/adminInquiryThreadPageClient';
import * as InquiryClientRepository from '@/features/inquiry/data/repository/inquiryClientRepository';
import type { InquiryCursor } from '@/features/inquiry/domain/types/page';
import { toDto } from '@/features/inquiry/ui/mapper/inquiryThreadMapper';
import type { InquiryMessageProps } from '@/features/inquiry/ui/model/inquiryMessageProps';
import type { InquiryThreadProps } from '@/features/inquiry/ui/model/inquiryThreadProps';
import useRouterWithProgress from '@/hooks/useRouterWithProgress';
import { inquiryKeys } from '@/queries/keys';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import SimpleBar from 'simplebar-react';

export function AdminContactPageClient({
  threadId,
  initialThreads,
  initialNextCursor,
  initialMessages,
}: {
  threadId?: string;
  initialThreads: InquiryThreadProps[];
  initialNextCursor: InquiryCursor | null;
  initialMessages: InquiryMessageProps[];
}) {
  const router = useRouterWithProgress();

  const { data } = useQuery({
    queryKey: inquiryKeys.threads(),
    queryFn: async () => {
      const page = await InquiryClientRepository.getInquiryThreads({
        cursor: null,
      });
      return {
        threads: page.threads.map(toDto),
        nextCursor: page.nextCursor,
      };
    },
    initialData: {
      threads: initialThreads,
      nextCursor: initialNextCursor,
    },
  });

  const selectThread = (id: string) => {
    const qs = new URLSearchParams({ threadId: id });
    router.replace(`/admin/contact?${qs.toString()}`);
  };

  return (
    <>
      <aside className='fixed top-0 left-0 flex h-screen w-(--sidebar-width) flex-col overflow-hidden border-gray-200'>
        <div className='flex items-center justify-between px-4 py-3'>
          <span className='font-semibold text-gray-900'>문의</span>
        </div>
        <SimpleBar className='simplebar-hover min-h-0 flex-1'>
          <ul className='m-0 list-none px-4 pb-4 p-0'>
            {data.threads.map(t => (
              <li key={t.id}>
                <button
                  type='button'
                  onClick={() => selectThread(t.id)}
                  className={clsx(
                    'w-full cursor-pointer rounded-sm p-3 text-left text-sm',
                    threadId === t.id
                      ? 'bg-blue-50 font-semibold text-blue-500'
                      : 'text-gray-900 hover:text-blue-500'
                  )}
                >
                  <div className='line-clamp-2'>{t.firstLineText}</div>
                  <div className='mt-0.5 text-xs text-gray-400'>
                    {t.secondLineText}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </SimpleBar>
      </aside>

      <main className='ml-(--sidebar-width) flex min-h-screen min-w-0 flex-1 flex-col'>
        {!threadId ? (
          <div className='flex flex-1 items-center justify-center text-gray-400'>
            스레드를 선택해주세요
          </div>
        ) : (
          <div className='min-h-0 flex-1'>
            <AdminInquiryThreadPageClient
              inquiryThreadId={threadId}
              initialMessages={initialMessages}
            />
          </div>
        )}
      </main>
    </>
  );
}
