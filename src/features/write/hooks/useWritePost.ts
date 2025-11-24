'use client';

import * as PostService from '@/features/post/domain/service/postService';
import { createProps as createPostProps } from '@/features/post/ui/postProps';
import { writePostSteps } from '@/features/write/constants/writePostStep';
import { validate } from '@/features/write/domain/model/writePostForm';
import { createProps } from '@/features/write/ui/writePostProps';
import { RootState } from '@/lib/redux/store';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function useWritePost() {
  const writePost = useSelector((state: RootState) => state.writePost);
  const writePostForm = useSelector((state: RootState) => state.writePostForm);
  const [writePostProps, setWritePostProps] = useState(createProps(writePost));
  const router = useRouter();

  const getInvalidField = useCallback(() => {
    const currentStep = writePostSteps[writePost.currentStepId];
    return (
      currentStep.fields.find(field => !validate(writePostForm, field)) ?? null
    );
  }, [writePost.currentStepId, writePostForm]);

  const createPost = useCallback(async () => {
    const { title, content, tags, password } = writePostForm;
    const post = await PostService.createPost({
      title: title.value,
      content: content.value,
      tags: tags.value,
      password: password.value,
    });
    return createPostProps(post);
  }, [writePostForm]);

  const updatePost = useCallback(
    async (postId: string) => {
      const { title, content, tags, password } = writePostForm;
      const post = await PostService.updatePost({
        postId,
        title: title.value,
        content: content.value,
        tags: tags.value,
        password: password.value,
      });
      return createPostProps(post);
    },
    [writePostForm]
  );

  useEffect(() => {
    const writePostProps = createProps(writePost);
    setWritePostProps(writePostProps);
  }, [writePost]);

  useEffect(() => {
    for (const step of Object.values(writePostSteps)) {
      if (writePost.currentStepId === step.id) break;
      const isValid = validate(writePostForm, ...step.fields);
      if (!isValid) {
        router.push(`/write?step=${step.id}`);
      }
    }
  }, [router, writePost.currentStepId, writePostForm]);

  return {
    writePost: writePostProps,
    getInvalidField,
    createPost,
    updatePost,
  } as const;
}
