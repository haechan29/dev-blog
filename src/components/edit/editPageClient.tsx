'use client';

import QueryParamsValidator from '@/components/queryParamsValidator';
import RestoreDraftDialog from '@/components/write/restoreDraftDialog';
import WritePostForm from '@/components/write/writePostForm';
import WritePostToolbar from '@/components/write/writePostToolbar';
import { PostProps } from '@/features/post/ui/postProps';
import { writePostSteps } from '@/features/write/constants/writePostStep';
import useAutoSave from '@/features/write/hooks/useAutoSave';
import useWritePostForm from '@/features/write/hooks/useWritePostForm';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

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
  const step = searchParams.get('step') as keyof typeof writePostSteps;
  const writePostForm = useWritePostForm({
    currentStepId: step,
    post,
  });
  const { draft, removeDraft } = useAutoSave({
    ...writePostForm,
    postId: post.id,
  });

  useEffect(() => {
    return () => removeDraft();
  }, [removeDraft]);

  return (
    <>
      <RestoreDraftDialog
        draft={draft}
        onRestore={(draft: string) => writePostForm.setContent(draft)}
      />
      <div className='w-screen h-dvh flex flex-col'>
        <WritePostToolbar
          publishPost={async () => writePostForm.updatePost(post.id)}
          removeDraft={removeDraft}
          {...writePostForm}
        />
        <div className='flex-1 min-h-0'>
          <WritePostForm {...writePostForm} />
        </div>
      </div>
    </>
  );
}
