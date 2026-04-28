'use client';

import Tooltip from '@/components/tooltip';
import { ApiError } from '@/errors/errors';
import * as PostClientRepository from '@/features/post/data/repository/postClientRepository';
import { PostVisibility } from '@/features/post/domain/types/postVisibility';
import clsx from 'clsx';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function PostVisibilityToggle({
  postId,
  initialVisibility,
  onSuccess,
}: {
  postId: string;
  initialVisibility: PostVisibility;
  onSuccess?: () => void;
}) {
  const [optimisticVisibility, setOptimisticVisibility] =
    useState(initialVisibility);
  const [isLoading, setIsLoading] = useState(false);
  const isPublic = optimisticVisibility === 'public';

  const onToggle = useCallback(async () => {
    if (isLoading) return;

    const newVisibility = isPublic ? 'unlisted' : 'public';
    const previousVisibility = optimisticVisibility;

    setOptimisticVisibility(newVisibility);
    setIsLoading(true);

    try {
      await PostClientRepository.updatePost({
        postId,
        visibility: newVisibility,
      });
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

  useEffect(() => {
    setOptimisticVisibility(initialVisibility);
  }, [initialVisibility]);

  return (
    <div className='flex items-center gap-2'>
      <Tooltip
        text={
          isPublic
            ? '피드와 검색에 노출됩니다'
            : '링크를 아는 사람만 볼 수 있습니다'
        }
      >
        <span className='text-sm text-gray-600'>
          <span className='hidden sm:inline'>
            {isPublic ? '전체 공개' : '일부 공개'}
          </span>
          <span className='sm:hidden'>{isPublic ? '공개' : '비공개'}</span>
        </span>
      </Tooltip>
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
    </div>
  );
}
