'use client';

import QueryParamsValidator from '@/components/queryParamsValidator';
import WritePostEditorWithPreview from '@/components/write/writePostEditorWithPreview';
import WritePostPassword from '@/components/write/writePostPassword';
import WritePostTag from '@/components/write/writePostTag';
import WritePostTitle from '@/components/write/writePostTitle';
import WritePostToolbar from '@/components/write/writePostToolbar';
import {
  WRITE_POST_STEPS,
  WritePostSteps,
} from '@/features/write/domain/model/writePostStep';
import useWritePost from '@/features/write/hooks/useWritePost';
import { useSearchParams } from 'next/navigation';

export default function WritePage() {
  return (
    <QueryParamsValidator
      queryKey='step'
      isValidValue={value => value !== null && value in WRITE_POST_STEPS}
      fallbackOption={{ type: 'defaultValue', value: 'write' }}
    >
      <WritePageWithValidation />
    </QueryParamsValidator>
  );
}

function WritePageWithValidation() {
  const searchParams = useSearchParams();
  const step = searchParams.get('step') as keyof WritePostSteps;
  const writePost = useWritePost({ currentStepId: step });

  return (
    <div>
      <WritePostToolbar {...writePost} />
      <WritePostTitle {...writePost} />
      <WritePostTag {...writePost} />
      <WritePostPassword {...writePost} />
      <WritePostEditorWithPreview {...writePost} />
    </div>
  );
}
