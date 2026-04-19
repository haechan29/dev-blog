import { AdminContactPageClient } from '@/components/contact/adminContactPageClient';
import * as InquiryServerRepository from '@/features/inquiry/data/repository/inquiryServerRepository';
import { toPropsList } from '@/features/inquiry/ui/lib';
import { toDto } from '@/features/inquiry/ui/mapper/inquiryThreadMapper';

export default async function AdminContactPage({
  searchParams,
}: {
  searchParams: Promise<{ threadId?: string }>;
}) {
  const { threadId } = await searchParams;

  const [threadsPage, messagesResult] = await Promise.all([
    InquiryServerRepository.getInquiryThreads({
      cursorUpdatedAt: null,
      cursorId: null,
    }),
    threadId
      ? InquiryServerRepository.getInquiryMessagesByThreadId({ threadId })
      : null,
  ]);

  const initialThreads = threadsPage.threads.map(toDto);
  const initialNextCursor = threadsPage.nextCursor;
  const initialMessages = messagesResult
    ? toPropsList(messagesResult.messages)
    : [];

  return (
    <div className='flex min-h-screen'>
      <AdminContactPageClient
        threadId={threadId}
        initialThreads={initialThreads}
        initialNextCursor={initialNextCursor}
        initialMessages={initialMessages}
      />
    </div>
  );
}
