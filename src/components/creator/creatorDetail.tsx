'use client';

import { Creator } from '@/features/creator/domain/model/creator';
import { OutreachEmail } from '@/features/outreach-email/domain/model/outreachEmail';

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
        {isEmailsLoading ? (
          <div className='text-gray-400'>로딩 중...</div>
        ) : emails.length === 0 ? (
          <div className='text-gray-400'>발송된 이메일이 없습니다</div>
        ) : (
          <ul className='space-y-3'>
            {emails.map(email => (
              <li key={email.id} className='p-3 border rounded'>
                <div className='font-medium'>{email.subject}</div>
                <div className='text-sm text-gray-500 mt-1'>
                  {email.sentAt.slice(0, 10)} ·{' '}
                  {email.status === 'responded' ? '답장 받음' : '대기 중'}
                </div>
              </li>
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
