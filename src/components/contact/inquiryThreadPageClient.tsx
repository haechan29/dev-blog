'use client';

import InquiryThreadContainer from '@/components/contact/inquiryThreadContainer';
import { ApiError } from '@/errors/errors';
import type { InquiryMessageDto } from '@/features/inquiry/data/dto/inquiryMessageDto';
import * as InquiryClientRepository from '@/features/inquiry/data/repository/inquiryClientRepository';
import { inquiryKeys } from '@/queries/keys';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function InquiryThreadPageClient({
  inquiryThreadId,
  initialMessages,
}: {
  inquiryThreadId: string;
  initialMessages: InquiryMessageDto[];
}) {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState('');
  const [images, setImages] = useState<string[]>([]);

  const {
    data: { messages },
  } = useQuery({
    queryKey: inquiryKeys.messages(inquiryThreadId),
    queryFn: () =>
      InquiryClientRepository.getMyInquiryMessagesByThreadId(inquiryThreadId),
    initialData: { messages: initialMessages },
  });

  const sendMutation = useMutation({
    mutationFn: ({
      content,
      images: imageIds,
    }: {
      content: string;
      images: string[];
    }) =>
      InquiryClientRepository.createInquiryMessage(
        inquiryThreadId,
        content,
        imageIds
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inquiryKeys.threads() });
      setDraft('');
      setImages([]);
    },
    onError: error => {
      const message =
        error instanceof ApiError ? error.message : '메시지를 보내지 못했습니다';
      toast.error(message);
    },
  });

  const handleSend = () => {
    sendMutation.mutate({ content: draft, images });
  };

  useEffect(() => {
    setDraft('');
    setImages([]);
  }, [inquiryThreadId]);

  return (
    <InquiryThreadContainer
      draft={draft}
      images={images}
      messages={messages}
      onDraftChange={setDraft}
      onSend={handleSend}
      isSending={sendMutation.isPending}
    />
  );
}
