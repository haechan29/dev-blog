'use client';

import QueryParamsValidator from '@/components/queryParamsValidator';
import RestoreDraftDialog from '@/components/write/restoreDraftDialog';
import WritePostForm from '@/components/write/writePostForm';
import WritePostToolbar from '@/components/write/writePostToolbar';
import { writePostSteps } from '@/features/write/constants/writePostStep';
import useAutoSave from '@/features/write/hooks/useAutoSave';
import useWritePost from '@/features/write/hooks/useWritePost';
import { AppDispatch } from '@/lib/redux/store';
import { setCurrentStepId } from '@/lib/redux/write/writePostSlice';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
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
  const step = searchParams.get('step') as keyof typeof writePostSteps;
  const dispatch = useDispatch<AppDispatch>();
  const { createPost } = useWritePost();
  const { draft, removeDraft } = useAutoSave();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    dispatch(setCurrentStepId(step));
  }, [dispatch, step]);

  useEffect(() => {
    if (draft && step === 'write') {
      setIsOpen(true);
    }
  }, [draft, step]);

  return (
    <>
      <RestoreDraftDialog draft={draft} isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className='w-screen h-dvh flex flex-col'>
        <WritePostToolbar publishPost={createPost} removeDraft={removeDraft} />
        <div className='flex-1 min-h-0'>
          <WritePostForm />
        </div>
      </div>
    </>
  );
}
