import { CommentEntityFlat } from '@/features/comment/data/entities/commentEntities';

export interface RankedCommentEntity extends CommentEntityFlat {
  score: number;
}
