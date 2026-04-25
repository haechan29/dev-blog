import * as CommentQueries from '@/features/comment/data/queries/commentQueries';
import { UserEntity } from '@/features/user/data/entities/userEntities';

export type CommentEntity = Awaited<
  ReturnType<typeof CommentQueries.fetchComment>
>;

export interface CommentEntityFlat {
  id: number;
  postId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  likeCount: number;
  userId: string;
  nickname: UserEntity['nickname'];
  deletedAt: UserEntity['deleted_at'];
  registeredAt: UserEntity['registered_at'];
  profileImageUrl: UserEntity['profile_image_url'];
  passwordHash?: string | null;
}
