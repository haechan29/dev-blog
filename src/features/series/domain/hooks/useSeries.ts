'use client';

import { Series } from '@/features/series/domain/model/series';
import * as SeriesClientService from '@/features/series/domain/service/seriesClientService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export default function useSeries(userId: string, initialData?: Series[]) {
  const queryClient = useQueryClient();

  const { data: seriesList } = useQuery({
    queryKey: ['series', userId],
    queryFn: () => SeriesClientService.fetchSeriesByUserId(userId),
    initialData,
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
