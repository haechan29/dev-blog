'use client';

import { WritePost } from '@/features/write/domain/model/writePost';
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

  const createPost = useCallback(async () => {
    const validation = validate(writePost);
    const isValid = Object.values(validation).every(v => v);
    if (!isValid) {
      setWritePost(prev => ({ ...prev, ...validation }));
      return;
    }
    console.log('게시글이 생성되었습니다');
  }, [writePost]);

  return {
    ...props,
    setTitle,
    setTags,
    setPassword,
    setContent,
    createPost,
  };
}

function validate({ title, password, content }: WritePost) {
  return {
    isTitleValid: title.trim().length > 0,
    isTagsValid: true,
    isPasswordValid: password.trim().length > 0,
    isContentValid: content.trim().length > 0,
  };
}
