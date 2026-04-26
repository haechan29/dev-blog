import { DraftDto } from '@/features/draft/data/dto/draftDto';
import { DraftEntity } from '@/features/draft/data/entities/draftEntities';

export function toDto(draft: DraftEntity): DraftDto {
  return {
    id: draft.id,
    userId: draft.userId,
    postId: draft.postId,
    title: draft.title,
    contentJson: draft.contentJson as object | null,
    tags: draft.tags,
    createdAt: draft.createdAt,
    updatedAt: draft.updatedAt,
  };
}
