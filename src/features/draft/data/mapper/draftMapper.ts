import { DraftDto } from '@/features/draft/data/dto/draftDto';
import { DraftEntity } from '@/features/draft/data/entities/draftEntities';

export function toDto(draft: DraftEntity): DraftDto {
  return {
    id: draft.id,
    userId: draft.user_id,
    postId: draft.post_id,
    title: draft.title,
    contentJson: draft.content_json,
    tags: draft.tags,
    createdAt: draft.created_at,
    updatedAt: draft.updated_at,
  };
}

