import { PostDto } from '@/features/post/data/dto/postDto';
import Post from '@/features/post/domain/model/post';

export default function toDomain(dto: PostDto): Post {
  return new Post(dto.slug, dto.title, dto.date, dto.content, dto.tags);
}
