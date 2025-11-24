'use client';

import { PostProps } from '@/features/post/ui/postProps';
import { writePostSteps } from '@/features/write/constants/writePostStep';
import {
  createProps,
  WritePostToolbarProps,
} from '@/features/write/ui/writePostToolbarProps';
import useNavigationWithParams from '@/hooks/useNavigationWithParams';
import { RootState } from '@/lib/redux/store';
import nProgress from 'nprogress';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

export default function useWritePostToolbar({
  publishPost,
  removeDraft,
}: {
  publishPost: () => Promise<PostProps>;
  removeDraft: () => void;
}) {
  const navigate = useNavigationWithParams();
  const writePost = useSelector((state: RootState) => state.writePost);
  const [writePostToolbar, setWritePostToolbar] =
    useState<WritePostToolbarProps>(createProps(writePost));

  const onAction = useCallback(async () => {
    const currentStep = writePostSteps[writePost.currentStepId];
    switch (currentStep.action) {
      case 'next': {
        navigate({ setParams: { step: 'upload' } });
        break;
      }
      case 'publish': {
        try {
          nProgress.start();
          const post = await publishPost();
          navigate({ pathname: `/posts/${post.id}` });
          removeDraft();
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : '게시글 생성에 실패했습니다';
          toast.error(errorMessage);
        } finally {
          nProgress.done();
        }
        break;
      }
    }
  }, [navigate, publishPost, removeDraft, writePost.currentStepId]);

  useEffect(() => {
    const writePostToolbar = createProps(writePost);
    setWritePostToolbar(writePostToolbar);
  }, [writePost]);

  return {
    writePostToolbar,
    onAction,
  } as const;
}
