'use client';

import InquiryThreadContainer from '@/components/contact/inquiryThreadContainer';
import { ApiError } from '@/errors/errors';
import { INQUIRY_MAX_IMAGES } from '@/features/inquiry/constants/inquiry';
import * as InquiryClientRepository from '@/features/inquiry/data/repository/inquiryClientRepository';
import { toPropsList } from '@/features/inquiry/ui/lib';
import type { InquiryImageDto } from '@/features/media/data/dto/inquiryImageDto';
import * as MediaClientRepository from '@/features/media/data/repository/mediaClientRepository';
import useRouterWithProgress from '@/hooks/useRouterWithProgress';
import { inquiryKeys } from '@/queries/keys';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import imageCompression from 'browser-image-compression';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function NewInquiryThreadPageClient() {
  const router = useRouterWithProgress();
  const queryClient = useQueryClient();

  const [draft, setDraft] = useState('');
  const [images, setImages] = useState<InquiryImageDto[]>([]);

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
    createMutation.mutate({
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

  return (
    <InquiryThreadContainer
      draft={draft}
      images={images}
      messages={toPropsList([])}
      onDraftChange={setDraft}
      onImageFilesPicked={handleImageFilesPicked}
      onSend={handleSend}
      isSending={createMutation.isPending}
      autoFocus
    />
  );
}
