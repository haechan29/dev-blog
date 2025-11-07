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
import { setCurrentStepId } from '@/lib/redux/writePostSlice';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

export default function EditPageClient({ post }: { post: PostProps }) {
  return (
    <QueryParamsValidator
      queryKey='step'
      isValidValue={value => value !== null && value in writePostSteps}
      fallbackOption={{ type: 'defaultValue', value: 'write' }}
    >
      <EditPageWithValidation post={post} />
    </QueryParamsValidator>
  );
}

function EditPageWithValidation({ post }: { post: PostProps }) {
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const {
    writePost: { writePostForm },
    updatePost,
  } = useWritePost();

  const { draft, removeDraft } = useAutoSave({
    writePostForm,
    postId: post.id,
  });

  useEffect(() => {
    const step = searchParams.get('step') as keyof typeof writePostSteps;
    dispatch(setCurrentStepId(step));
    return () => removeDraft();
  }, [dispatch, removeDraft, searchParams]);

  return (
    <>
      <RestoreDraftDialog draft={draft} />
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
