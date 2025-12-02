'use client';

import * as SeriesClientService from '@/features/series/domain/service/seriesClientService';
import { createProps, SeriesProps } from '@/features/series/ui/seriesProps';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export default function useSeries(userId: string, initialData?: SeriesProps[]) {
  const queryClient = useQueryClient();

  const { data: seriesList } = useQuery({
    queryKey: ['series', userId],
    queryFn: async () => {
      const seriesList = await SeriesClientService.fetchSeriesByUserId(userId);
      return seriesList.map(createProps);
    },
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
