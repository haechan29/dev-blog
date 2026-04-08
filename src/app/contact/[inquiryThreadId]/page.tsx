import InquiryThreadPageClient from '@/components/contact/inquiryThreadPageClient';
import * as InquiryServerRepository from '@/features/inquiry/data/repository/inquiryServerRepository';
import { getUserId } from '@/lib/user';

export default async function InquiryThreadPage({
  params,
}: {
  params: Promise<{ inquiryThreadId: string }>;
}) {
  const { inquiryThreadId } = await params;
  const userId = await getUserId();
  const { messages } =
    await InquiryServerRepository.getMyInquiryMessagesByThreadId({
      userId,
      threadId: inquiryThreadId,
    });

  return (
    <InquiryThreadPageClient
      inquiryThreadId={inquiryThreadId}
      initialMessages={messages}
    />
  );
}
