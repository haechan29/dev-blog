import { PostRequestDto } from '@/features/post/data/dto/postRequestDto';
import { PostResponseDto } from '@/features/post/data/dto/postResponseDto';
import Post from '@/features/post/domain/model/post';

export function toDomain(dto: PostResponseDto): Post {
  return new Post(
    dto.id,
    dto.authorName,
    dto.title,
    dto.createdAt,
    dto.updatedAt,
    dto.content,
    dto.tags,
    dto.authorId
  );
}

export function toData(params: {
  title: string;
  content: string;
  tags: string[];
  password: string;
}): PostRequestDto {
  return params;
}
