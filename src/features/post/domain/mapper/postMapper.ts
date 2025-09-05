import { Post } from '@/features/post/domain/model/post';
import { PostDto } from '@/features/post/data/dto/postDto';

export default function toDomain(dto: PostDto): Post {
  return new Post(
    dto.slug,
    dto.title,
    dto.date,
    dto.content,
    dto.tags
  );
}