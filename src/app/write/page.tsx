'use client';

import QueryParamsValidator from '@/components/queryParamsValidator';
import RestoreDraftDialog from '@/components/write/restoreDraftDialog';
import WritePostForm from '@/components/write/writePostForm';
import WritePostToolbar from '@/components/write/writePostToolbar';
import { writePostSteps } from '@/features/write/constants/writePostStep';
import useAutoSave from '@/features/write/hooks/useAutoSave';
import useWritePost from '@/features/write/hooks/useWritePost';
import { AppDispatch } from '@/lib/redux/store';
import { setCurrentStepId } from '@/lib/redux/writePostSlice';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

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
  const dispatch = useDispatch<AppDispatch>();
  const {
    writePost: { writePostForm },
    createPost,
  } = useWritePost();
  const { draft, removeDraft } = useAutoSave({ writePostForm });

  useEffect(() => {
    const step = searchParams.get('step') as keyof typeof writePostSteps;
    dispatch(setCurrentStepId(step));
  }, [dispatch, searchParams]);

  return (
    <>
      <RestoreDraftDialog draft={draft} />
      <div className='w-screen h-dvh flex flex-col'>
        <WritePostToolbar publishPost={createPost} removeDraft={removeDraft} />
        <div className='flex-1 min-h-0'>
          <WritePostForm />
        </div>
      </div>
    </>
  );
}
