'use client';

import * as PostClientService from '@/features/post/domain/service/postClientService';
import * as SeriesClientService from '@/features/series/domain/service/seriesClientService';
import { createProps, SeriesProps } from '@/features/series/ui/seriesProps';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export default function useSeriesPosts(
  userId: string,
  seriesId: string,
  initialData: SeriesProps
) {
  const queryClient = useQueryClient();

  const { data: series } = useQuery({
    queryKey: ['series', seriesId, 'posts'],
    queryFn: async () => {
      const series = await SeriesClientService.fetchSeries(userId, seriesId);
      return createProps(series);
    },
    initialData,
  });

  const addPostMutation = useMutation({
    mutationFn: (postId: string) => {
      return PostClientService.updatePost({
        postId,
        seriesId,
        seriesOrder: series.postCount,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['series', seriesId, 'posts'],
      });
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

      return PostClientService.updatePostsInSeries(updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['series', seriesId, 'posts'],
      });
    },
  });

  return {
    posts: series?.posts,
    addPostMutation,
    removePostMutation,
  } as const;
}
