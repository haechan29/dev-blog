'use client';

import { SubscriptionDto } from '@/features/subscription/data/dto/subscriptionDto';
import * as SubscriptionClientRepository from '@/features/subscription/data/repository/subscriptionClientRepository';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { useCallback } from 'react';

export default function SubscribeButton({
  authorId,
  userId,
  isSubscribed,
}: {
  authorId: string;
  userId?: string;
  isSubscribed: boolean;
}) {
  const queryClient = useQueryClient();

  const subscribe = useMutation({
    mutationFn: () => SubscriptionClientRepository.subscribe(authorId),
    onSuccess: () => {
      queryClient.setQueryData<SubscriptionDto>(
        ['subscription', authorId],
        prev =>
          prev && {
            isSubscribed: true,
            subscriberCount: prev.subscriberCount + 1,
          }
      );
    },
  });

  const unsubscribe = useMutation({
    mutationFn: () => SubscriptionClientRepository.unsubscribe(authorId),
    onSuccess: () => {
      queryClient.setQueryData<SubscriptionDto>(
        ['subscription', authorId],
        prev =>
          prev && {
            isSubscribed: false,
            subscriberCount: prev.subscriberCount - 1,
          }
      );
    },
  });

  const handleClick = useCallback(() => {
    if (isSubscribed) {
      unsubscribe.mutate();
    } else {
      subscribe.mutate();
    }
  }, [isSubscribed, subscribe, unsubscribe]);

  return (
    userId !== authorId && (
      <button
        onClick={handleClick}
        className={clsx(
          'px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer',
          isSubscribed
            ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            : 'bg-blue-500 text-white hover:bg-blue-600'
        )}
      >
        {isSubscribed ? '구독중' : '구독'}
      </button>
    )
  );
}
