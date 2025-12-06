'use client';

import * as SeriesClientService from '@/features/series/domain/service/seriesClientService';
import { createProps, SeriesProps } from '@/features/series/ui/seriesProps';
import { ApiError } from '@/lib/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export default function useSeriesList(
  userId: string,
  initialData?: SeriesProps[]
) {
  const queryClient = useQueryClient();

  const { data: seriesList } = useQuery({
    queryKey: ['user', userId, 'series'],
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
        queryKey: ['user', userId, 'series'],
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
    }) => SeriesClientService.updateSeries({ userId, ...params }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['user', userId, 'series'],
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
      SeriesClientService.deleteSeries({ userId, seriesId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['user', userId, 'series'],
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
