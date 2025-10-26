'use client';

import { writePostSteps } from '@/features/write/constants/writePostStep';
import { WritePostToolbar } from '@/features/write/domain/model/writePostToolbar';
import {
  createProps,
  WritePostToolbarProps,
} from '@/features/write/ui/writePostToolbarProps';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

export default function useWritePostToolbar({
  currentStepId,
}: {
  currentStepId: keyof typeof writePostSteps;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

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
        const params = new URLSearchParams(searchParams);
        params.set('step', 'upload');
        router.push(`${pathname}?${params.toString()}`);
        break;
      case 'publish':
        console.log('게시글이 생성되었습니다');
        break;
    }
  }, [pathname, router, searchParams, writePostToolbar.currentStepId]);

  useEffect(
    () => setWritePostToolbar(prev => ({ ...prev, currentStepId })),
    [currentStepId]
  );

  return {
    writePostToolbar: writePostToolbarProps,
    onAction,
  } as const;
}
