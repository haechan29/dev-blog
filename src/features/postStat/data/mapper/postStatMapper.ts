import { PostStatResponseDto } from '@/features/postStat/data/dto/postStatResponseDto';
import { PostStat } from '@/features/postStat/domain/types/postStat';

export function toData(postStat: PostStat): PostStatResponseDto {
  return {
    id: postStat.id,
    postId: postStat.post_id,
    likeCount: postStat.like_count,
    viewCount: postStat.view_count,
  };
}
