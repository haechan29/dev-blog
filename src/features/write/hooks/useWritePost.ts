'use client';

import * as PostService from '@/features/post/domain/service/postService';
import { createProps as createPostProps } from '@/features/post/ui/postProps';
import { createProps } from '@/features/post/ui/writePostProps';
import { writePostSteps } from '@/features/write/constants/writePostStep';
import { validate } from '@/features/write/domain/model/writePostForm';
import { RootState } from '@/lib/redux/store';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function useWritePost() {
  const writePost = useSelector((state: RootState) => state.writePost);
  const [writePostProps, setWritePostProps] = useState(createProps(writePost));

  const getInvalidField = useCallback(() => {
    const writePostForm = writePost.writePostForm;
    const currentStep = writePostSteps[writePostForm.currentStepId];
    return (
      currentStep.fields.find(field => !validate(writePostForm, field)) ?? null
    );
  }, [writePost.writePostForm]);

  const createPost = useCallback(async () => {
    const {
      writePostForm: { title, content, tags, password },
    } = writePost;
    const post = await PostService.createPost({
      title: title.value,
      content: content.value,
      tags: tags.value,
      password: password.value,
    });
    return createPostProps(post);
  }, [writePost]);

  const updatePost = useCallback(
    async (postId: string) => {
      const {
        writePostForm: { title, content, tags, password },
      } = writePost;
      const post = await PostService.updatePost({
        postId,
        title: title.value,
        content: content.value,
        tags: tags.value,
        password: password.value,
      });
      return createPostProps(post);
    },
    [writePost]
  );

  useEffect(() => {
    const writePostProps = createProps(writePost);
    setWritePostProps(writePostProps);
  }, [writePost]);

  return {
    writePost: writePostProps,
    getInvalidField,
    createPost,
    updatePost,
  } as const;
}
