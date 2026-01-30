'use client';

import QueryParamsValidator from '@/components/queryParamsValidator';
import RestoreDraftDialog from '@/components/write/restoreDraftDialog';
import WritePostForm from '@/components/write/writePostForm';
import WritePostToolbar from '@/components/write/writePostToolbar';
import * as PostClientService from '@/features/post/domain/service/postClientService';
import { createProps, PostProps } from '@/features/post/ui/postProps';
import { writePostSteps } from '@/features/write/constants/writePostStep';
import useAutoSave from '@/features/write/hooks/useAutoSave';
import { AppDispatch, RootState } from '@/lib/redux/store';
import {
  resetWritePostForm,
  setContent,
  setTags,
  setTitle,
  setVisibility,
} from '@/lib/redux/write/writePostFormSlice';
import { setCurrentStepId } from '@/lib/redux/write/writePostSlice';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function EditPageClient({
  skipPasswordInput,
  post,
}: {
  skipPasswordInput: boolean;
  post: PostProps;
}) {
  const searchParams = useSearchParams();
  const step = searchParams.get('step') as keyof typeof writePostSteps;
  const dispatch = useDispatch<AppDispatch>();
  const writePostForm = useSelector((state: RootState) => state.writePostForm);
  const { draft, removeDraft } = useAutoSave(post.id);
  const [isOpen, setIsOpen] = useState(false);

  const updatePost = useCallback(
    async (postId: string) => {
      const { title, content, tags, password, visibility } = writePostForm;
      const post = await PostClientService.updatePost({
        postId,
        title: title.value,
        content: content.value,
        tags: tags.value,
        password: password.value,
        visibility,
      });
      return createProps(post);
    },
    [writePostForm]
  );

  useEffect(() => {
    dispatch(setCurrentStepId(step));
    return () => removeDraft();
  }, [dispatch, removeDraft, step]);

  useEffect(() => {
    dispatch(setContent({ value: post.content, isUserInput: false }));
    dispatch(setTitle({ value: post.title, isUserInput: false }));
    dispatch(setTags({ value: post.tags, isUserInput: false }));
    dispatch(setVisibility(post.visibility));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (draft && step === 'write') {
      setIsOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      dispatch(resetWritePostForm());
    };
  }, [dispatch]);

  return (
    <div className='w-screen h-dvh flex flex-col'>
      <QueryParamsValidator
        queryKey='step'
        isValidValue={value => value !== null && value in writePostSteps}
        fallbackOption={{ type: 'defaultValue', value: 'write' }}
      >
        <RestoreDraftDialog
          draft={draft}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
        <WritePostToolbar
          skipPasswordInput={skipPasswordInput}
          publishPost={async () => updatePost(post.id)}
          removeDraft={removeDraft}
        />
        <div className='flex-1 min-h-0'>
          <WritePostForm skipPasswordInput={skipPasswordInput} />
        </div>
      </QueryParamsValidator>
    </div>
  );
}
