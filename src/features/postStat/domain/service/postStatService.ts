import * as PostStatRepository from '@/features/postStat/data/repository/postStatRepository';
import toDomain from '@/features/postStat/domain/mapper/postStatMapper';
import PostStat from '@/features/postStat/domain/model/postStat';

export async function fetchPostStat(postId: string): Promise<PostStat> {
  const dto = await PostStatRepository.fetchPostStat(postId);
  return toDomain(dto);
}

export async function incrementLikeCount(postId: string): Promise<PostStat> {
  const dto = await PostStatRepository.incrementLikeCount(postId);
  return toDomain(dto);
}
