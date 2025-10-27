'use client';

import { writePostSteps } from '@/features/write/constants/writePostStep';
import { WritePostToolbar } from '@/features/write/domain/model/writePostToolbar';
import {
  createProps,
  WritePostToolbarProps,
} from '@/features/write/ui/writePostToolbarProps';
import useNavigationWithParams from '@/hooks/useNavigationWithParams';
import { useCallback, useEffect, useMemo, useState } from 'react';

export default function useWritePostToolbar({
  currentStepId,
}: {
  currentStepId: keyof typeof writePostSteps;
}) {
  const navigate = useNavigationWithParams();
  const [writePostToolbar, setWritePostToolbar] = useState<WritePostToolbar>({
    currentStepId,
  });

  const writePostToolbarProps: WritePostToolbarProps = useMemo(
    () => createProps({ currentStepId }),
    [currentStepId]
  );

  const onAction = useCallback(() => {
    const currentStep = writePostSteps[writePostToolbar.currentStepId];
    switch (currentStep.action) {
      case 'next':
        navigate({ setParams: { step: 'upload' } });
        break;
      case 'publish':
        console.log('게시글이 생성되었습니다');
        break;
    }
  }, [navigate, writePostToolbar.currentStepId]);

  useEffect(
    () => setWritePostToolbar(prev => ({ ...prev, currentStepId })),
    [currentStepId]
  );

  return {
    writePostToolbar: writePostToolbarProps,
    onAction,
  } as const;
}
