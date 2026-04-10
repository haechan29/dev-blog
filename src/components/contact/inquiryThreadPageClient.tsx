'use client';

import InquiryThreadContainer from '@/components/contact/inquiryThreadContainer';
import type { InquiryMessageDto } from '@/features/inquiry/data/dto/inquiryMessageDto';
import * as InquiryClientRepository from '@/features/inquiry/data/repository/inquiryClientRepository';
import { inquiryKeys } from '@/queries/keys';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

export default function InquiryThreadPageClient({
  inquiryThreadId,
  initialMessages,
}: {
  inquiryThreadId: string;
  initialMessages: InquiryMessageDto[];
}) {
  const [draft, setDraft] = useState('');

  const {
    data: { messages },
  } = useQuery({
    queryKey: inquiryKeys.messages(inquiryThreadId),
    queryFn: () =>
      InquiryClientRepository.getMyInquiryMessagesByThreadId(inquiryThreadId),
    initialData: { messages: initialMessages },
  });

  const sendMessage = async () => {};

  useEffect(() => {
    setDraft('');
  }, [inquiryThreadId]);

  return (
    <InquiryThreadContainer
      draft={draft}
      messages={messages}
      onDraftChange={setDraft}
      onSend={sendMessage}
    />
  );
}
