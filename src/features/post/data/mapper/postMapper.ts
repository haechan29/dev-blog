import { PostDto } from '@/features/post/data/dto/postDto';
import { PostEntity } from '@/features/post/data/entities/postEntities';

export function toDto(post: PostEntity): PostDto {
  return {
    id: post.id,
    title: post.title,
    tags: post.tags,
    content: post.content,
    createdAt: post.created_at,
    updatedAt: post.updated_at ?? post.created_at,
    userId: post.user_id,
    guestId: post.guest_id,
    authorName:
      post.users?.nickname ||
      `Guest#${post.guest_id?.slice(0, 4) ?? '0000'}` ||
      '익명',
    isDeleted: !!post.user_id && !!post.users?.deleted_at,
    isGuest: !post.user_id,
    seriesId: post.seriesId,
    seriesOrder: post.seriesOrder,
  };
}
