'use client';

import { PostProps } from '@/features/post/ui/postProps';
import { writePostSteps } from '@/features/write/constants/writePostStep';
import { WritePostToolbar } from '@/features/write/domain/model/writePostToolbar';
import {
  createProps,
  WritePostToolbarProps,
} from '@/features/write/ui/writePostToolbarProps';
import useNavigationWithParams from '@/hooks/useNavigationWithParams';
import nProgress from 'nprogress';
import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

export default function useWritePostToolbar({
  currentStepId,
  createPost,
}: {
  currentStepId: keyof typeof writePostSteps;
  createPost: () => Promise<PostProps>;
}) {
  const navigate = useNavigationWithParams();
  const [writePostToolbar, setWritePostToolbar] = useState<WritePostToolbar>({
    currentStepId,
  });

  const writePostToolbarProps: WritePostToolbarProps = useMemo(
    () => createProps({ currentStepId }),
    [currentStepId]
  );

  const onAction = useCallback(async () => {
    const currentStep = writePostSteps[writePostToolbar.currentStepId];
    switch (currentStep.action) {
      case 'next': {
        navigate({ setParams: { step: 'upload' } });
        break;
      }
      case 'publish': {
        try {
          nProgress.start();
          const post = await createPost();
          navigate({ pathname: `/posts/${post.id}` });
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
  }, [createPost, navigate, writePostToolbar.currentStepId]);

  useEffect(
    () => setWritePostToolbar(prev => ({ ...prev, currentStepId })),
    [currentStepId]
  );

  return {
    writePostToolbar: writePostToolbarProps,
    onAction,
  } as const;
}
