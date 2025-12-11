'use client';

import * as SubscriptionClientRepository from '@/features/subscription/data/repository/subscriptionClientRepository';
import * as SubscriptionClientService from '@/features/subscription/domain/service/subscriptionClientService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { useCallback } from 'react';

export default function SubscribeButton({
  authorId,
  userId: userId,
}: {
  authorId: string;
  userId?: string;
}) {
  const queryClient = useQueryClient();

  const { data: isSubscribed, isLoading } = useQuery({
    queryKey: ['subscription', authorId],
    queryFn: () => SubscriptionClientService.checkSubscription(authorId),
    enabled: userId !== authorId,
  });

  const subscribe = useMutation({
    mutationFn: () => SubscriptionClientRepository.subscribe(authorId),
    onSuccess: () => {
      queryClient.setQueryData(['subscription', authorId], {
        isSubscribed: true,
      });
    },
  });

  const unsubscribe = useMutation({
    mutationFn: () => SubscriptionClientRepository.unsubscribe(authorId),
    onSuccess: () => {
      queryClient.setQueryData(['subscription', authorId], {
        isSubscribed: false,
      });
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
        disabled={isLoading}
        className={clsx(
          'px-4 py-2 rounded-full text-sm font-medium transition-colors',
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
