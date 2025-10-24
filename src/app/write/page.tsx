'use client';

import QueryParamsValidator from '@/components/queryParamsValidator';
import WritePostForm from '@/components/write/writePostForm';
import WritePostToolbar from '@/components/write/writePostToolbar';
import { writePostSteps } from '@/features/write/constants/writePostStep';
import useWritePost from '@/features/write/hooks/useWritePost';
import { useSearchParams } from 'next/navigation';

export default function WritePage() {
  return (
    <QueryParamsValidator
      queryKey='step'
      isValidValue={value => value !== null && value in writePostSteps}
      fallbackOption={{ type: 'defaultValue', value: 'write' }}
    >
      <WritePageWithValidation />
    </QueryParamsValidator>
  );
}

function WritePageWithValidation() {
  const searchParams = useSearchParams();
  const step = searchParams.get('step') as keyof typeof writePostSteps;
  const writePost = useWritePost({ currentStepId: step });

  return (
    <div className='w-screen h-dvh flex flex-col'>
      <WritePostToolbar {...writePost} />
      <div className='flex-1 min-h-0'>
        <WritePostForm {...writePost} />
      </div>
    </div>
  );
}
