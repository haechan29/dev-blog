import { PostResponseDto } from '@/features/post/data/dto/postResponseDto';
import { Post } from '@/types/env';

export function toData(post: Post): PostResponseDto {
  return {
    id: post.id,
    authorName: post.author_name,
    title: post.title,
    tags: post.tags,
    content: post.content,
    createdAt: post.created_at,
    updatedAt: post.updated_at,
    authorId: post.author_id,
  };
}
