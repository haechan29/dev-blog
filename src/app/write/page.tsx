'use client';

import QueryParamsValidator from '@/components/queryParamsValidator';
import WritePostForm from '@/components/write/writePostForm';
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
    <div className='w-full overflow-x-hidden'>
      <WritePostToolbar {...writePost} />
      <WritePostForm {...writePost} />
    </div>
  );
}
