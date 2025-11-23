'use client';

import QueryParamsValidator from '@/components/queryParamsValidator';
import RestoreDraftDialog from '@/components/write/restoreDraftDialog';
import WritePostForm from '@/components/write/writePostForm';
import WritePostToolbar from '@/components/write/writePostToolbar';
import { PostProps } from '@/features/post/ui/postProps';
import { writePostSteps } from '@/features/write/constants/writePostStep';
import useAutoSave from '@/features/write/hooks/useAutoSave';
import useWritePost from '@/features/write/hooks/useWritePost';
import { AppDispatch } from '@/lib/redux/store';
import {
  setContent,
  setTags,
  setTitle,
} from '@/lib/redux/write/writePostFormSlice';
import { setCurrentStepId } from '@/lib/redux/write/writePostSlice';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

export default function EditPageClient({ post }: { post: PostProps }) {
  return (
    <Suspense>
      <QueryParamsValidator
        queryKey='step'
        isValidValue={value => value !== null && value in writePostSteps}
        fallbackOption={{ type: 'defaultValue', value: 'write' }}
      >
        <EditPageWithValidation post={post} />
      </QueryParamsValidator>
    </Suspense>
  );
}

function EditPageWithValidation({ post }: { post: PostProps }) {
  const searchParams = useSearchParams();
  const step = searchParams.get('step') as keyof typeof writePostSteps;
  const dispatch = useDispatch<AppDispatch>();
  const { updatePost } = useWritePost();
  const { draft, removeDraft } = useAutoSave(post.id);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    dispatch(setCurrentStepId(step));
    return () => removeDraft();
  }, [dispatch, removeDraft, step]);

  useEffect(() => {
    dispatch(setContent({ value: post.content, isUserInput: false }));
    dispatch(setTitle({ value: post.title, isUserInput: false }));
    dispatch(setTags({ value: post.tags, isUserInput: false }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (draft && step === 'write') {
      setIsOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <RestoreDraftDialog draft={draft} isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className='w-screen h-dvh flex flex-col'>
        <WritePostToolbar
          publishPost={async () => updatePost(post.id)}
          removeDraft={removeDraft}
        />
        <div className='flex-1 min-h-0'>
          <WritePostForm />
        </div>
      </div>
    </>
  );
}
