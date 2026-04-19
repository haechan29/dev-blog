import Link from 'next/link';
import * as InquiryServerRepository from '@/features/inquiry/data/repository/inquiryServerRepository';
import { assertAdmin } from '@/lib/admin';

export default async function AdminContactPage({
  searchParams,
}: {
  searchParams: Promise<{ threadId?: string }>;
}) {
  await assertAdmin();

  const { threadId } = await searchParams;

  const threadsPage = await InquiryServerRepository.getInquiryThreads({
    cursorUpdatedAt: null,
    cursorId: null,
  });

  const messagesResult = threadId
    ? await InquiryServerRepository.getInquiryMessagesByThreadId({
        threadId,
      })
    : null;

  return (
    <div className='min-h-screen flex gap-4 p-4'>
      <aside className='w-80 shrink-0 border-r pr-4'>
        <p className='mb-2 font-medium'>문의 스레드</p>
        <ul className='space-y-1 text-sm'>
          {threadsPage.threads.map(t => (
            <li key={t.id}>
              <Link
                className={
                  threadId === t.id ? 'underline' : 'text-muted-foreground'
                }
                href={`/admin/contact?threadId=${t.id}`}
              >
                {t.lastMessagePreview ?? t.id} · {t.status}
              </Link>
            </li>
          ))}
        </ul>
      </aside>
      <main className='min-w-0 flex-1'>
        <p className='mb-2 font-medium'>메시지</p>
        {!threadId && (
          <p className='text-sm text-muted-foreground'>
            왼쪽에서 스레드를 선택하세요.
          </p>
        )}
        {threadId && messagesResult && (
          <ul className='space-y-2 text-sm'>
            {messagesResult.messages.map(m => (
              <li key={m.id} className='border-b pb-2'>
                <span className='text-muted-foreground'>
                  {m.senderType} · {m.createdAt}
                </span>
                <p className='whitespace-pre-wrap'>{m.content}</p>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
