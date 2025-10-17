'use client';

import { WritePost } from '@/features/write/domain/model/writePost';
import { WRITE_POST_STEPS } from '@/features/write/domain/model/writePostStep';
import {
  createProps,
  WritePostProps,
} from '@/features/write/ui/writePostProps';
import { useCallback, useMemo, useState } from 'react';

export default function useWritePost() {
  const [writePost, setWritePost] = useState<WritePost>({
    title: '',
    tags: [],
    password: '',
    content: '',
    isTitleValid: true,
    isTagsValid: true,
    isPasswordValid: true,
    isContentValid: true,
    currentStep: 'write',
    totalSteps: WRITE_POST_STEPS,
  });

  const props: WritePostProps = useMemo(
    () => createProps(writePost),
    [writePost]
  );

  const resetValidity = useCallback(() => {
    setWritePost(prev => ({
      ...prev,
      isTitleValid: true,
      isTagsValid: true,
      isPasswordValid: true,
      isContentValid: true,
    }));
  }, []);

  const setTitle = useCallback(
    (title: string) => {
      setWritePost(prev => ({ ...prev, title }));
      resetValidity();
    },
    [resetValidity]
  );

  const setTags = useCallback(
    (tagsString: string) => {
      const tagsArray = tagsString
        .split('#')
        .map(tag => tag.trim())
        .filter(Boolean);
      setWritePost(prev => ({ ...prev, tags: tagsArray }));
      resetValidity();
    },
    [resetValidity]
  );

  const setPassword = useCallback(
    (password: string) => {
      setWritePost(prev => ({ ...prev, password }));
      resetValidity();
    },
    [resetValidity]
  );

  const setContent = useCallback(
    (content: string) => {
      setWritePost(prev => ({ ...prev, content }));
      resetValidity();
    },
    [resetValidity]
  );

  const handleNext = useCallback(() => {
    const validation = validateContent(writePost);
    const isValid = Object.values(validation).every(v => v);
    if (isValid) {
      setWritePost(prev => ({ ...prev, currentStep: 'upload' }));
    } else {
      setWritePost(prev => ({ ...prev, ...validation }));
    }
  }, [writePost]);

  const handlePublish = useCallback(() => {
    const validation = validateMeta(writePost);
    const isValid = Object.values(validation).every(v => v);
    if (isValid) {
      console.log('게시글이 생성되었습니다');
    } else {
      setWritePost(prev => ({ ...prev, ...validation }));
    }
  }, [writePost]);

  const onAction = useCallback(
    (action: string) => {
      switch (action) {
        case 'next':
          handleNext();
          break;
        case 'publish':
          handlePublish();
          break;
      }
    },
    [handleNext, handlePublish]
  );

  return {
    ...props,
    setTitle,
    setTags,
    setPassword,
    setContent,
    onAction,
  };
}

function validateContent(writePost: WritePost) {
  return {
    isContentValid: writePost.content.trim().length > 0,
  };
}

function validateMeta(writePost: WritePost) {
  return {
    isTitleValid: writePost.title.trim().length > 0,
    isTagsValid: true,
    isPasswordValid: writePost.password.trim().length > 0,
  };
}
