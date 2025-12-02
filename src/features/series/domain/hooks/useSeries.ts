'use client';

import * as SeriesClientService from '@/features/series/domain/service/seriesClientService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export default function useSeries(userId: string) {
  const queryClient = useQueryClient();

  const { data: seriesList } = useQuery({
    queryKey: ['series', userId],
    queryFn: () => SeriesClientService.fetchSeriesByUserId(userId),
  });

  const createSeriesMutation = useMutation({
    mutationFn: (params: { title: string; description: string | null }) =>
      SeriesClientService.createSeries({ userId, ...params }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['series', userId],
      });
    },
  });

  return { seriesList, createSeriesMutation } as const;
}
