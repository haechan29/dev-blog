'use client';

import InquiryThreadContainer from '@/components/contact/inquiryThreadContainer';
import { ApiError } from '@/errors/errors';
import * as InquiryClientRepository from '@/features/inquiry/data/repository/inquiryClientRepository';
import useRouterWithProgress from '@/hooks/useRouterWithProgress';
import { inquiryKeys } from '@/queries/keys';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function NewInquiryThreadPageClient() {
  const router = useRouterWithProgress();
  const queryClient = useQueryClient();

  const [draft, setDraft] = useState('');
  const [images, setImages] = useState<string[]>([]);

  const createMutation = useMutation({
    mutationFn: ({ content, images }: { content: string; images: string[] }) =>
      InquiryClientRepository.createInquiryThread(content, images),
    onSuccess: ({ threadId }) => {
      queryClient.invalidateQueries({
        queryKey: inquiryKeys.threads(),
      });
      setDraft('');
      setImages([]);
      router.push(`/contact/${threadId}`);
    },
    onError: error => {
      const message =
        error instanceof ApiError ? error.message : '문의를 보내지 못했습니다';
      toast.error(message);
    },
  });

  const handleSend = () => {
    createMutation.mutate({ content: draft, images });
  };

  return (
    <InquiryThreadContainer
      draft={draft}
      images={images}
      messages={[]}
      onDraftChange={setDraft}
      onSend={handleSend}
      isSending={createMutation.isPending}
      autoFocus
    />
  );
}
