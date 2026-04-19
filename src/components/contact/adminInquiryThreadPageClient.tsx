'use client';

import InquiryThreadContainer from '@/components/contact/inquiryThreadContainer';
import { ApiError } from '@/errors/errors';
import { INQUIRY_MAX_IMAGES } from '@/features/inquiry/constants/inquiry';
import * as InquiryClientRepository from '@/features/inquiry/data/repository/inquiryClientRepository';
import * as InquiryAction from '@/features/inquiry/domain/action/inquiryAction';
import { toPropsList } from '@/features/inquiry/ui/lib';
import type {
  InquiryImageProps,
  InquiryReadyImageProps,
  InquiryUploadingImageProps,
} from '@/features/inquiry/ui/model/inquiryImageProps';
import type { InquiryMessageProps } from '@/features/inquiry/ui/model/inquiryMessageProps';
import * as MediaClientRepository from '@/features/media/data/repository/mediaClientRepository';
import { inquiryKeys } from '@/queries/keys';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import imageCompression from 'browser-image-compression';
import { nanoid } from 'nanoid';
import { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

export function AdminInquiryThreadPageClient({
  inquiryThreadId,
  initialMessages,
}: {
  inquiryThreadId: string;
  initialMessages: InquiryMessageProps[];
}) {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState('');
  const [images, setImages] = useState<InquiryImageProps[]>([]);
  const imagesRef = useRef<InquiryImageProps[]>([]);
  imagesRef.current = images;

  const {
    data: { messages },
  } = useQuery({
    queryKey: inquiryKeys.messages(inquiryThreadId),
    queryFn: () =>
      InquiryClientRepository.getInquiryMessagesByThreadId(
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
      InquiryAction.createAdminInquiryMessageAction({
        threadId: inquiryThreadId,
        content,
        images: imageIds,
      }),
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
      images: images
        .filter((img): img is InquiryReadyImageProps => img.status === 'ready')
        .slice(0, INQUIRY_MAX_IMAGES)
        .map(({ id }) => id),
    });
  };

  const handleImageRemove = useCallback((img: InquiryImageProps) => {
    if (img.status !== 'ready') {
      URL.revokeObjectURL(img.previewUrl);
    }
    setImages(prev => prev.filter(item => item.clientId !== img.clientId));
  }, []);

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

        const { id, url } =
          await MediaClientRepository.uploadInquiryImage(compressed);
        URL.revokeObjectURL(previewUrl);
        setImages(prev =>
          prev.map(img =>
            img.clientId === clientId
              ? { status: 'ready' as const, clientId, id, url }
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
    setDraft('');
    setImages(prev => {
      prev.forEach(img => {
        if (img.status !== 'ready') {
          URL.revokeObjectURL(img.previewUrl);
        }
      });
      return [];
    });
  }, [inquiryThreadId]);

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
      threadId={inquiryThreadId}
      draft={draft}
      images={images}
      messages={messages}
      onDraftChange={setDraft}
      onImageFilesPicked={handleImageFilesPicked}
      onImageRemove={handleImageRemove}
      onSend={handleSend}
      isSending={sendMutation.isPending}
      readOnlyMessages
      embeddedInAdmin
    />
  );
}
