'use client';

import InquiryThreadContainer from '@/components/contact/inquiryThreadContainer';
import { ApiError } from '@/errors/errors';
import { INQUIRY_MAX_IMAGES } from '@/features/inquiry/constants/inquiry';
import * as InquiryClientRepository from '@/features/inquiry/data/repository/inquiryClientRepository';
import { toPropsList } from '@/features/inquiry/ui/lib';
import {
  InquiryImageProps,
  InquiryReadyImageProps,
  InquiryUploadingImageProps,
} from '@/features/inquiry/ui/model/inquiryImageProps';
import * as MediaClientRepository from '@/features/media/data/repository/mediaClientRepository';
import useRouterWithProgress from '@/hooks/useRouterWithProgress';
import { inquiryKeys } from '@/queries/keys';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import imageCompression from 'browser-image-compression';
import { nanoid } from 'nanoid';
import { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

export default function NewInquiryThreadPageClient() {
  const router = useRouterWithProgress();
  const queryClient = useQueryClient();

  const [draft, setDraft] = useState('');
  const [images, setImages] = useState<InquiryImageProps[]>([]);
  const imagesRef = useRef<InquiryImageProps[]>([]);
  imagesRef.current = images;

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
      images: images
        .filter((img): img is InquiryReadyImageProps => img.status === 'ready')
        .slice(0, INQUIRY_MAX_IMAGES)
        .map(({ id }) => id),
    });
  };

  const handleImageFilesPicked = useCallback(async (files: File[]) => {
    const images = imagesRef.current;
    const left = INQUIRY_MAX_IMAGES - images.length;
    if (left === 0) return;

    const uploadingImages: InquiryUploadingImageProps[] = files
      .slice(0, left)
      .map(file => ({
        status: 'uploading' as const,
        file,
        clientId: nanoid(),
        previewUrl: URL.createObjectURL(file),
      }));

    setImages(prev => [...prev, ...uploadingImages]);

    for (const { file, clientId, previewUrl } of uploadingImages) {
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
        URL.revokeObjectURL(previewUrl);
        setImages(prev =>
          prev.map(img =>
            img.status !== 'ready' && img.clientId === clientId
              ? { status: 'ready' as const, id: dto.id, url: dto.url }
              : img
          )
        );
      } catch {
        setImages(prev =>
          prev.map(img =>
            img.status === 'uploading' && img.clientId === clientId
              ? { status: 'error' as const, clientId, previewUrl }
              : img
          )
        );
      }
    }
  }, []);

  useEffect(() => {
    return () => {
      imagesRef.current.forEach(img => {
        if (img.status !== 'ready') {
          URL.revokeObjectURL(img.previewUrl);
        }
      });
    };
  }, []);

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
