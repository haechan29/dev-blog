'use client';

import QueryParamsValidator from '@/components/queryParamsValidator';
import RestoreDraftDialog from '@/components/write/restoreDraftDialog';
import WritePostForm from '@/components/write/writePostForm';
import WritePostToolbar from '@/components/write/writePostToolbar';
import * as PostClientService from '@/features/post/domain/service/postClientService';
import { createProps } from '@/features/post/ui/postProps';
import { writePostSteps } from '@/features/write/constants/writePostStep';
import useAutoSave from '@/features/write/hooks/useAutoSave';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { setCurrentStepId } from '@/lib/redux/write/writePostSlice';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function WritePageClient({
  isLoggedIn,
}: {
  isLoggedIn: boolean;
}) {
  const searchParams = useSearchParams();
  const step = searchParams.get('step') as keyof typeof writePostSteps;
  const dispatch = useDispatch<AppDispatch>();
  const writePostForm = useSelector((state: RootState) => state.writePostForm);
  const { draft, removeDraft } = useAutoSave();
  const [isOpen, setIsOpen] = useState(false);

  const createPost = useCallback(async () => {
    const { title, content, tags, password } = writePostForm;
    const post = await PostClientService.createPost({
      title: title.value,
      content: content.value,
      tags: tags.value,
      password: password.value,
    });
    return createProps(post);
  }, [writePostForm]);

  useEffect(() => {
    dispatch(setCurrentStepId(step));
  }, [dispatch, step]);

  useEffect(() => {
    if (draft && step === 'write') {
      setIsOpen(true);
    }
  }, [draft, step]);

  return (
    <QueryParamsValidator
      queryKey='step'
      isValidValue={value => value !== null && value in writePostSteps}
      fallbackOption={{ type: 'defaultValue', value: 'write' }}
    >
      <RestoreDraftDialog draft={draft} isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className='w-screen h-dvh flex flex-col'>
        <WritePostToolbar
          isLoggedIn={isLoggedIn}
          publishPost={createPost}
          removeDraft={removeDraft}
        />
        <div className='flex-1 min-h-0'>
          <WritePostForm isLoggedIn={isLoggedIn} />
        </div>
      </div>
    </QueryParamsValidator>
  );
}
