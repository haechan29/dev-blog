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

  const setTitle = useCallback((title: string) => {
    setWritePost(prev => ({ ...prev, title, isTitleValid: true }));
  }, []);

  const setTags = useCallback((tagsString: string) => {
    const tagsArray = tagsString
      .split('#')
      .map(tag => tag.trim())
      .filter(Boolean);
    setWritePost(prev => ({ ...prev, tags: tagsArray, isTagsValid: true }));
  }, []);

  const setPassword = useCallback((password: string) => {
    setWritePost(prev => ({ ...prev, password, isPasswordValid: true }));
  }, []);

  const setContent = useCallback((content: string) => {
    setWritePost(prev => ({ ...prev, content, isContentValid: true }));
  }, []);

  return {
    ...props,
    setTitle,
    setTags,
    setPassword,
    setContent,
  };
}
