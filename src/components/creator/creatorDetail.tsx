'use client';

import { Creator } from '@/features/creator/domain/model/creator';
import * as OutreachEmailClientRepository from '@/features/outreach-email/data/repository/outreachEmailClientRepository';
import { OutreachEmail } from '@/features/outreach-email/domain/model/outreachEmail';
import { api } from '@/lib/api';
import { useCallback, useEffect, useState } from 'react';

export function CreatorDetail({ creator }: { creator: Creator | null }) {
  const [emails, setEmails] = useState<OutreachEmail[]>([]);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSend = useCallback(async () => {
    if (!creator?.id) return;

    if (!subject || !body) {
      alert('제목과 본문을 입력해주세요');
      return;
    }

    setIsSending(true);
    try {
      await api.post('/api/gmail/send', {
        creatorId: creator.id,
        subject,
        body,
      });

      const data = await OutreachEmailClientRepository.getOutreachEmails(
        creator.id
      );
      setEmails(data);

      setSubject('');
      setBody('');
    } catch (error) {
      console.error(error);
      alert('발송에 실패했습니다');
    } finally {
      setIsSending(false);
    }
  }, [body, creator?.id, subject]);

  useEffect(() => {
    if (!creator?.id) return;

    const fetchEmails = async () => {
      setIsLoading(true);
      try {
        const data = await OutreachEmailClientRepository.getOutreachEmails(
          creator.id
        );
        setEmails(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEmails();
  }, [creator?.id]);

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
        {isLoading ? (
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
                  {email.status === 'responded' ? '답신 받음' : '대기 중'}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className='p-4 border-t'>
        <h3 className='font-semibold mb-2'>새 이메일</h3>
        <div className='space-y-2'>
          <input
            type='text'
            placeholder='제목'
            value={subject}
            onChange={e => setSubject(e.target.value)}
            className='w-full px-3 py-2 border rounded'
          />
          <textarea
            placeholder='본문'
            value={body}
            onChange={e => setBody(e.target.value)}
            rows={5}
            className='w-full px-3 py-2 border rounded resize-none'
          />
          <button
            onClick={handleSend}
            disabled={isSending}
            className='px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50'
          >
            {isSending ? '발송 중...' : '발송'}
          </button>
        </div>
      </section>
    </main>
  );
}
