import { PostStatResponseDto } from '@/features/postStat/data/dto/postStatResponseDto';
import PostStat from '@/features/postStat/domain/model/postStat';

export default function toDomain(postStatDto: PostStatResponseDto): PostStat {
  return new PostStat(
    postStatDto.id,
    postStatDto.postId,
    postStatDto.likeCount,
    postStatDto.viewCount
  );
}
