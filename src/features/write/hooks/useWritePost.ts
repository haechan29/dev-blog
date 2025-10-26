'use client';

import { writePostSteps } from '@/features/write/constants/writePostStep';
import { WritePost } from '@/features/write/domain/model/writePost';
import {
  createProps,
  WritePostProps,
} from '@/features/write/ui/writePostProps';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

export default function useWritePost({
  currentStepId,
}: {
  currentStepId: keyof typeof writePostSteps;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [writePost, setWritePost] = useState<WritePost>({
    currentStepId,
  });

  const writePostProps: WritePostProps = useMemo(
    () => createProps(writePost),
    [writePost]
  );

  const handleAction = useCallback(() => {
    const currentStep = writePostSteps[writePost.currentStepId];
    switch (currentStep.action) {
      case 'next':
        const params = new URLSearchParams(searchParams);
        params.set('step', 'upload');
        router.push(`${pathname}?${params.toString()}`);
        break;
      case 'publish':
        console.log('게시글이 생성되었습니다');
        break;
    }
  }, [pathname, router, searchParams, writePost.currentStepId]);

  const onAction = useCallback(() => {
    // const currentStep = writePostSteps[writePost.currentStepId];
    // const isValid = validate(writePostForm, ...currentStep.fields);
    // if (!isValid) return;
    handleAction();
  }, [handleAction]);

  useEffect(() => {
    setWritePost(prev => ({ ...prev, currentStepId, shouldValidate: false }));
  }, [currentStepId]);

  useEffect(() => {
    // for (const step of Object.values(writePostSteps)) {
    //   if (writePost.currentStepId === step.id) return;
    //   const isValid = validate(writePostForm, ...step.fields);
    //   if (!isValid) {
    //     router.push(`/write?step=${step.id}`);
    //   }
    // }
  }, []);

  return {
    writePost: writePostProps,
    onAction,
  };
}
