'use client';

import InquiryThreadContainer from '@/components/contact/inquiryThreadContainer';
import { ApiError } from '@/errors/errors';
import { INQUIRY_MAX_IMAGES } from '@/features/inquiry/constants/inquiry';
import * as InquiryClientRepository from '@/features/inquiry/data/repository/inquiryClientRepository';
import { toPropsList } from '@/features/inquiry/ui/lib';
import { InquiryMessageProps } from '@/features/inquiry/ui/model/inquiryMessageProps';
import type { InquiryImageDto } from '@/features/media/data/dto/inquiryImageDto';
import * as MediaClientRepository from '@/features/media/data/repository/mediaClientRepository';
import { inquiryKeys } from '@/queries/keys';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import imageCompression from 'browser-image-compression';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function InquiryThreadPageClient({
  inquiryThreadId,
  initialMessages,
}: {
  inquiryThreadId: string;
  initialMessages: InquiryMessageProps[];
}) {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState('');
  const [images, setImages] = useState<InquiryImageDto[]>([]);

  const {
    data: { messages },
  } = useQuery({
    queryKey: inquiryKeys.messages(inquiryThreadId),
    queryFn: () =>
      InquiryClientRepository.getMyInquiryMessagesByThreadId(
        inquiryThreadId
      ).then(({ messages }) => ({ messages: toPropsList(messages) })),
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
        error instanceof ApiError
          ? error.message
          : '메시지를 보내지 못했습니다';
      toast.error(message);
    },
  });

  const handleSend = () => {
    sendMutation.mutate({
      content: draft,
      images: images.map(({ id }) => id),
    });
  };

  const handleImageFilesPicked = async (files: File[]) => {
    for (const file of files) {
      try {
        const shouldSkipCompression =
          file.size < 1024 * 1024 || file.type === 'image/gif';

        const compressed = shouldSkipCompression
          ? file
          : await imageCompression(file, {
              maxSizeMB: 1,
              initialQuality: 0.8,
              maxWidthOrHeight: 1920,
            });

        const dto = await MediaClientRepository.uploadInquiryImage(compressed);
        setImages(prev => {
          if (prev.length >= INQUIRY_MAX_IMAGES) return prev;
          return [...prev, dto];
        });
      } catch (error) {
        const message =
          error instanceof ApiError
            ? error.message
            : '이미지를 올리지 못했습니다';
        toast.error(message);
      }
    }
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
      onImageFilesPicked={handleImageFilesPicked}
      onSend={handleSend}
      isSending={sendMutation.isPending}
    />
  );
}
