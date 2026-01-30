'use client';

import { ApiError } from '@/errors/errors';
import * as PostClientService from '@/features/post/domain/service/postClientService';
import { PostVisibility } from '@/features/post/domain/types/postVisibility';
import clsx from 'clsx';
import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';

export default function PostVisibilityToggle({
  postId,
  optimisticVisibility,
  setOptimisticVisibility,
  onSuccess,
}: {
  postId: string;
  optimisticVisibility: PostVisibility;
  setOptimisticVisibility: (visibility: PostVisibility) => void;
  onSuccess?: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const isPublic = optimisticVisibility === 'public';

  const onToggle = useCallback(async () => {
    if (isLoading) return;

    const newVisibility = isPublic ? 'unlisted' : 'public';
    const previousVisibility = optimisticVisibility;

    setOptimisticVisibility(newVisibility);
    setIsLoading(true);

    try {
      await PostClientService.updatePost({ postId, visibility: newVisibility });
      onSuccess?.();
    } catch (error) {
      setOptimisticVisibility(previousVisibility);
      const message =
        error instanceof ApiError
          ? error.message
          : '공개 설정을 변경하는 데에 실패했습니다';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [
    isLoading,
    isPublic,
    onSuccess,
    optimisticVisibility,
    postId,
    setOptimisticVisibility,
  ]);

  return (
    <button
      onClick={onToggle}
      disabled={isLoading}
      aria-label={isPublic ? '전체 공개 해제' : '전체 공개 설정'}
      className={clsx(
        'relative w-11 h-6 rounded-full transition-colors duration-200 hover:opacity-80 cursor-pointer',
        isPublic ? 'bg-blue-500' : 'bg-gray-300'
      )}
    >
      <div
        className={clsx(
          'absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200',
          isPublic ? 'translate-x-5.5' : 'translate-x-0.5'
        )}
      />
    </button>
  );
}
