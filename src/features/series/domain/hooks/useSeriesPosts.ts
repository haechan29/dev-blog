'use client';

import * as SeriesClientService from '@/features/series/domain/service/seriesClientService';
import { createProps } from '@/features/series/ui/seriesProps';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export default function useSeriesPosts(userId: string, seriesId: string) {
  const queryClient = useQueryClient();

  const { data: series } = useQuery({
    queryKey: ['series', seriesId, 'posts'],
    queryFn: async () => {
      const series = await SeriesClientService.fetchSeries(userId, seriesId);
      return createProps(series);
    },
  });

  return {
    posts: series?.posts,
  } as const;
}
