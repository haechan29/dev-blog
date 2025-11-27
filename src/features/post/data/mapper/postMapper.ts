import { PostResponseDto } from '@/features/post/data/dto/postResponseDto';
import { Post } from '@/features/post/domain/types/post';

export function toData(post: Post): PostResponseDto {
  return {
    id: post.id,
    title: post.title,
    tags: post.tags,
    content: post.content,
    createdAt: post.created_at,
    updatedAt: post.updated_at,
    userId: post.user_id,
    guestId: post.guest_id,
    authorName: post.author_name,
  };
}
