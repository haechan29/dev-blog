'use client';

import { ApiError } from '@/errors/errors';
import * as SeriesClientRepository from '@/features/series/data/repository/seriesClientRepository';
import { toProps } from '@/features/series/ui/mapper/seriesMapper';
import { SeriesProps } from '@/features/series/ui/props/seriesProps';
import { userKeys } from '@/queries/keys';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export default function useSeriesList(
  userId: string,
  initialData?: SeriesProps[]
) {
  const queryClient = useQueryClient();

  const { data: seriesList } = useQuery({
    queryKey: userKeys.seriesList(userId),
    queryFn: async () => {
      const seriesList =
        await SeriesClientRepository.fetchSeriesByUserId(userId);
      return seriesList.map(toProps);
    },
    initialData,
  });

  const createSeriesMutation = useMutation({
    mutationFn: (params: { title: string; description: string | null }) =>
      SeriesClientRepository.createSeries({ userId, ...params }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: userKeys.seriesList(userId),
      });
    },
    onError: error => {
      const message =
        error instanceof ApiError
          ? error.message
          : '시리즈 생성에 실패했습니다';
      toast.error(message);
    },
  });

  const updateSeriesMutation = useMutation({
    mutationFn: (params: {
      seriesId: string;
      title: string;
      description: string | null;
    }) => SeriesClientRepository.updateSeries({ userId, ...params }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: userKeys.seriesList(userId),
      });
    },
    onError: error => {
      const message =
        error instanceof ApiError
          ? error.message
          : '시리즈 수정에 실패했습니다';
      toast.error(message);
    },
  });

  const deleteSeriesMutation = useMutation({
    mutationFn: (seriesId: string) =>
      SeriesClientRepository.deleteSeries({ userId, seriesId }),
    onSuccess: (_, seriesId) => {
      queryClient.removeQueries({
        queryKey: userKeys.series(userId, seriesId),
      });
      queryClient.invalidateQueries({
        queryKey: userKeys.seriesList(userId),
      });
    },
    onError: error => {
      const message =
        error instanceof ApiError
          ? error.message
          : '시리즈 삭제에 실패했습니다';
      toast.error(message);
    },
  });

  return {
    seriesList,
    createSeriesMutation,
    updateSeriesMutation,
    deleteSeriesMutation,
  } as const;
}
