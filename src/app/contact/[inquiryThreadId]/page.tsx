import InquiryThreadPageClient from '@/components/contact/inquiryThreadPageClient';
import * as InquiryServerRepository from '@/features/inquiry/data/repository/inquiryServerRepository';
import { toPropsList } from '@/features/inquiry/ui/lib';
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
    }).then(({ messages }) => ({ messages: toPropsList(messages) }));

  return (
    <InquiryThreadPageClient
      inquiryThreadId={inquiryThreadId}
      initialMessages={messages}
    />
  );
}
