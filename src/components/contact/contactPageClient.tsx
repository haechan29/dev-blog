'use client';

import type { InquiryThreadDto } from '@/features/inquiry/data/dto/inquiryThreadDto';
import type { InquiryThreadStatus } from '@/features/inquiry/domain/types/inquiryThreadStatus';
import { formatDate } from '@/features/post/domain/lib/date';
import clsx from 'clsx';
import { Archive, CircleCheck, Clock, MessageSquarePlus } from 'lucide-react';

const MOCK_THREADS: InquiryThreadDto[] = [
  {
    id: 'mock-thread-1',
    status: 'AWAITING_REPLY',
    firstMessagePreview: '결제 내역이 이상하게 보여서 문의드립니다.',
    firstMessageId: 'mock-msg-1',
    lastMessagePreview: '스크린샷도 함께 첨부했습니다.',
    lastMessageId: 'mock-msg-2',
    userUnreadCount: 0,
    adminUnreadCount: 1,
    createdAt: '2026-04-01T10:00:00.000Z',
    updatedAt: '2026-04-05T14:30:00.000Z',
  },
  {
    id: 'mock-thread-2',
    status: 'ANSWERED',
    firstMessagePreview: '계정 삭제 절차가 궁금합니다.',
    firstMessageId: 'mock-msg-3',
    lastMessagePreview:
      '안내해 주신 대로 진행하면 됩니다. 추가 문의는 언제든 주세요.',
    lastMessageId: 'mock-msg-4',
    userUnreadCount: 1,
    adminUnreadCount: 0,
    createdAt: '2026-03-20T09:00:00.000Z',
    updatedAt: '2026-03-21T11:00:00.000Z',
  },
  {
    id: 'mock-thread-3',
    status: 'CLOSED',
    firstMessagePreview: '이전에 문의드린 건 해결되었습니다.',
    firstMessageId: 'mock-msg-5',
    lastMessagePreview: '감사합니다.',
    lastMessageId: 'mock-msg-6',
    userUnreadCount: 0,
    adminUnreadCount: 0,
    createdAt: '2026-02-10T08:00:00.000Z',
    updatedAt: '2026-02-15T16:00:00.000Z',
  },
];

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

export default function ContactPageClient() {
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
          <button
            type='button'
            className='flex shrink-0 items-center justify-center gap-2 self-start px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-700 transition-colors font-medium sm:self-auto'
          >
            <MessageSquarePlus className='w-5 h-5' strokeWidth={2} />
            문의하기
          </button>
        </div>

        <section aria-labelledby='inquiry-history-heading'>
          <h2
            id='inquiry-history-heading'
            className='text-lg font-semibold mb-4'
          >
            내 문의 내역
          </h2>

          {MOCK_THREADS.length === 0 ? (
            <div className='text-center py-20 text-gray-500'>
              아직 문의 내역이 없습니다.
            </div>
          ) : (
            <div className='flex flex-col'>
              {MOCK_THREADS.map((thread, index) => (
                <div key={thread.id} className='mb-8'>
                  <div className='flex gap-3'>
                    {/* 왼쪽 상태 아이콘 + 새 답변 dot */}
                    <div className='relative shrink-0 pt-0.5'>
                      {statusIcon(thread.status)}
                      {thread.userUnreadCount > 0 && (
                        <span className='absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-red-500 ring-2 ring-white' />
                      )}
                    </div>

                    {/* 오른쪽 콘텐츠 */}
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
                  </div>
                  {index !== MOCK_THREADS.length - 1 && (
                    <div className='mt-8 h-px bg-gray-200' />
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
