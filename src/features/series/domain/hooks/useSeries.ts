'use client';

import { ApiError } from '@/errors/errors';
import * as PostClientRepository from '@/features/post/data/repository/postClientRepository';
import * as SeriesClientService from '@/features/series/domain/service/seriesClientService';
import { createProps, SeriesProps } from '@/features/series/ui/seriesProps';
import { userKeys } from '@/queries/keys';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export default function useSeries(initialSeries: SeriesProps) {
  const { id: seriesId, userId } = initialSeries;

  const queryClient = useQueryClient();

  const { data: series } = useQuery({
    queryKey: userKeys.series(userId, seriesId),
    queryFn: async () => {
      const series = await SeriesClientService.fetchSeries(userId, seriesId);
      return createProps(series);
    },
    initialData: initialSeries,
  });

  const addPostMutation = useMutation({
    mutationFn: (postId: string) => {
      return PostClientRepository.updatePostsInSeries([
        {
          id: postId,
          seriesId,
          seriesOrder: series.postCount,
        },
      ]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: userKeys.seriesList(userId),
      });
    },
    onError: error => {
      const message =
        error instanceof ApiError
          ? error.message
          : '시리즈에 게시글을 추가하는 데에 실패했습니다';
      toast.error(message);
    },
  });

  const removePostMutation = useMutation({
    mutationFn: (postId: string) => {
      const updates = [
        { id: postId, seriesId: null, seriesOrder: null },
        ...series.posts
          .filter(post => post.id !== postId)
          .map((post, index) => ({
            id: post.id,
            seriesId,
            seriesOrder: index,
          })),
      ];

      return PostClientRepository.updatePostsInSeries(updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: userKeys.seriesList(userId),
      });
    },
    onError: error => {
      const message =
        error instanceof ApiError
          ? error.message
          : '시리즈에서 게시글을 제거하는 데에 실패했습니다';
      toast.error(message);
    },
  });

  const reorderPostsMutation = useMutation({
    mutationFn: (reorderedPosts: SeriesProps['posts']) => {
      return PostClientRepository.updatePostsInSeries(reorderedPosts);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: userKeys.series(userId, seriesId),
      });
    },
    onError: error => {
      queryClient.invalidateQueries({
        queryKey: userKeys.series(userId, seriesId),
      });

      const message =
        error instanceof ApiError
          ? error.message
          : '게시글 순서 변경에 실패했습니다';
      toast.error(message);
    },
  });

  return {
    series,
    addPostMutation,
    removePostMutation,
    reorderPostsMutation,
  } as const;
}
