'use client';

import * as SeriesClientService from '@/features/series/domain/service/seriesClientService';
import { useQuery } from '@tanstack/react-query';

export default function useSeries(userId: string) {
  const { data: seriesList } = useQuery({
    queryKey: ['series', userId],
    queryFn: () => SeriesClientService.fetchSeriesByUserId(userId),
  });

  return { seriesList } as const;
}
