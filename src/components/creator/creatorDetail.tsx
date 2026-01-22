'use client';

import {
  Creator,
  CREATOR_STATUS_LABELS,
} from '@/features/creator/domain/model/creator';
import { OutreachEmail } from '@/features/outreach-email/domain/model/outreachEmail';
import { formatDateBrief } from '@/lib/date';
import clsx from 'clsx';
import { ChevronRight, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';

export function CreatorDetail({
  creator,
  emails,
  isEmailsLoading,
  onSendEmail,
  onSync,
  isSyncing,
}: {
  creator: Creator | null;
  emails: OutreachEmail[];
  isEmailsLoading: boolean;
  onSendEmail: () => void;
  onSync: () => void;
  isSyncing: boolean;
}) {
  const [openEmailId, setOpenEmailId] = useState<string | null>(null);

  useEffect(() => {
    setOpenEmailId(emails[0]?.id ?? null);
  }, [emails]);

  if (!creator) {
    return (
      <main className='flex-1 flex items-center justify-center text-gray-400'>
        크리에이터를 선택해주세요
      </main>
    );
  }

  return (
    <main className='flex-1 flex flex-col overflow-hidden'>
      <section className='p-4 border-b'>
        <div className='flex items-center gap-3 mb-2'>
          <h2 className='text-xl font-bold'>{creator.channelName}</h2>
          <span className='text-xs px-2 py-0.5 rounded bg-gray-200 text-gray-700'>
            {CREATOR_STATUS_LABELS[creator.status]}
          </span>
          <div className='flex-1' />
          <button
            onClick={onSendEmail}
            className='px-3 py-1.5 text-sm bg-blue-500 text-white font-semibold rounded hover:bg-blue-400 cursor-pointer'
          >
            메일 작성
          </button>
        </div>
        {creator.memo && (
          <div className='text-sm text-gray-600'>{creator.memo}</div>
        )}
      </section>

      <section className='flex-1 p-4 overflow-y-auto'>
        <div className='flex items-center gap-2 mb-2'>
          <h3 className='font-semibold'>이메일 히스토리</h3>
          <button
            onClick={onSync}
            disabled={isSyncing}
            className='p-1 hover:bg-gray-100 rounded disabled:opacity-50'
          >
            <RefreshCw
              className={clsx(
                'w-4 h-4 text-gray-500',
                isSyncing && 'animate-spin'
              )}
            />
          </button>
        </div>

        {isEmailsLoading ? (
          <div className='text-gray-400'>로딩 중...</div>
        ) : emails.length === 0 ? (
          <div className='text-gray-400'>발송된 이메일이 없습니다</div>
        ) : (
          <ul>
            {emails.map((email, index) => (
              <EmailTimelineItem
                key={email.id}
                email={email}
                isFirst={index === 0}
                isLast={index === emails.length - 1}
                isOpen={openEmailId === email.id}
                onToggle={() =>
                  setOpenEmailId(openEmailId === email.id ? null : email.id)
                }
              />
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

function EmailTimelineItem({
  email,
  isFirst,
  isLast,
  isOpen,
  onToggle,
}: {
  email: OutreachEmail;
  isFirst: boolean;
  isLast: boolean;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const isSent = email.direction === 'sent';

  return (
    <li className='flex gap-3 group'>
      <div className='w-20 text-xs text-gray-500 text-right pt-0.5 shrink-0'>
        <div>{formatDateBrief(email.sentAt)}</div>
        <div className={clsx(!isSent && 'text-blue-600 font-medium')}>
          {isSent ? '보냄' : '받음'}
        </div>
      </div>

      <div className='flex flex-col items-center'>
        <div className={clsx('w-px h-2 bg-gray-200', isFirst && 'invisible')} />
        <div
          className={clsx(
            'w-2 h-2 rounded-full shrink-0',
            isSent ? 'bg-gray-300' : 'bg-blue-500'
          )}
        />
        <div
          className={clsx('w-px flex-1 bg-gray-200', isLast && 'invisible')}
        />
      </div>

      <div className='flex-1 mb-8'>
        <button
          onClick={onToggle}
          className='w-full text-left p-2 -m-2 cursor-pointer'
        >
          <div className='flex items-center gap-1'>
            <span
              className={clsx('font-medium', !email.subject && 'text-gray-400')}
            >
              {email.subject || '(제목 없음)'}
            </span>
            <ChevronRight
              className={clsx(
                'w-4 h-4 text-gray-400 group-hover:text-gray-600 shrink-0 transition-transform',
                isOpen && 'rotate-90'
              )}
            />
          </div>
        </button>

        {isOpen && (
          <div className='mt-3 p-3 bg-gray-50 rounded-lg text-sm text-gray-900 whitespace-pre-wrap'>
            {email.body}
          </div>
        )}
      </div>
    </li>
  );
}
