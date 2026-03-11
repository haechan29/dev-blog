'use client';

import { DraftDto } from '@/features/draft/data/dto/draftDto';
import * as DraftClientRepository from '@/features/draft/data/repository/draftClientRepository';
import { draftKeys } from '@/queries/keys';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export default function useDrafts(initialData?: DraftDto[]) {
  const queryClient = useQueryClient();

  const { data: drafts } = useQuery({
    queryKey: draftKeys.list(),
    queryFn: DraftClientRepository.getDrafts,
    initialData,
  });

  const saveDraftMutation = useMutation({
    mutationFn: (params: {
      draftId?: string | null;
      postId?: string | null;
      title?: string;
      contentJson?: object | null;
      tags?: string[];
    }) => {
      if (params.draftId) {
        return DraftClientRepository.updateDraft({
          ...params,
          draftId: params.draftId,
        });
      }
      return DraftClientRepository.createDraft(params);
    },
    onSuccess: savedDraft => {
      queryClient.setQueryData(
        draftKeys.list(),
        (old: DraftDto[] | undefined) => {
          if (!old) return [savedDraft];
          const idx = old.findIndex(d => d.id === savedDraft.id);
          if (idx >= 0) {
            const next = [...old];
            next[idx] = savedDraft;
            return next;
          }
          return [savedDraft, ...old];
        }
      );
    },
  });

  const deleteDraftMutation = useMutation({
    mutationFn: (draftId: string) => DraftClientRepository.deleteDraft(draftId),
    onSuccess: (_, draftId) => {
      queryClient.setQueryData(
        draftKeys.list(),
        (old: DraftDto[] | undefined) =>
          old ? old.filter(d => d.id !== draftId) : []
      );
    },
  });

  return {
    drafts,
    saveDraftMutation,
    deleteDraftMutation,
  } as const;
}
