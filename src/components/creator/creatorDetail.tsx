'use client';

import { Creator } from '@/features/creator/domain/model/creator';
import { OutreachEmail } from '@/features/outreach-email/domain/model/outreachEmail';
import clsx from 'clsx';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';

export function CreatorDetail({
  creator,
  emails,
  isEmailsLoading,
  onSendEmail,
}: {
  creator: Creator | null;
  emails: OutreachEmail[];
  isEmailsLoading: boolean;
  onSendEmail: () => void;
}) {
  const [openEmailId, setOpenEmailId] = useState<string | null>(null);

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
        <h2 className='text-xl font-bold mb-2'>{creator.channelName}</h2>
        <div className='text-sm text-gray-600 space-y-1'>
          <div>이메일: {creator.email}</div>
          <div>상태: {creator.status}</div>
          <div>메모: {creator.memo ?? '-'}</div>
        </div>
      </section>

      <section className='flex-1 p-4 overflow-y-auto'>
        <h3 className='font-semibold mb-2'>이메일 히스토리</h3>

        {!isEmailsLoading && emails.length > 0 && (
          <EmailStatusSummary emails={emails} />
        )}

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

      <section className='p-4 border-t'>
        <button
          onClick={onSendEmail}
          className='w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-400'
        >
          새 이메일 작성
        </button>
      </section>
    </main>
  );
}

function EmailStatusSummary({ emails }: { emails: OutreachEmail[] }) {
  const lastEmail = emails[0];
  if (!lastEmail) return null;

  const daysSince = Math.floor(
    (Date.now() - new Date(lastEmail.sentAt).getTime()) / (1000 * 60 * 60 * 24)
  );

  const daysText = daysSince === 0 ? '오늘' : `${daysSince}일 전`;
  const directionText = lastEmail.direction === 'sent' ? '발송' : '수신';

  return (
    <div className='text-sm text-gray-600 mb-4 p-2 bg-gray-50 rounded'>
      마지막 {directionText}: {daysText}
    </div>
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
      <div className='flex flex-col items-center'>
        <div className={clsx('w-px h-2 bg-gray-200', isFirst && 'invisible')} />
        <div className='w-2 h-2 rounded-full shrink-0 bg-grey-300' />
        <div
          className={clsx('w-px flex-1 bg-gray-200', isLast && 'invisible')}
        />
      </div>

      <div className='flex-1 mb-4'>
        <button
          onClick={onToggle}
          className='w-full text-left p-2 -m-2 cursor-pointer'
        >
          <div className='flex items-center gap-1'>
            <span className='font-medium'>{email.subject}</span>
            <ChevronRight
              className={clsx(
                'w-4 h-4 text-gray-400 group-hover:text-gray-600 shrink-0 transition-transform',
                isOpen && 'rotate-90'
              )}
            />
          </div>
          <div className='text-sm text-gray-500 mt-1'>
            {email.sentAt.slice(0, 10)} · {isSent ? '보냄' : '받음'}
          </div>
        </button>

        {isOpen && (
          <div className='mt-2 text-sm text-gray-700 whitespace-pre-wrap'>
            {email.body}
          </div>
        )}
      </div>
    </li>
  );
}
