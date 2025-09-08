import * as PostStatRespository from '@/features/postStat/data/repository/postStatRepository';
import toDomain from '@/features/postStat/domain/mapper/postStatMapper';
import PostStat from '@/features/postStat/domain/model/postStat';

export async function fetchPostStat(postId: string): Promise<PostStat> {
  const dto = await PostStatRespository.fetchPostStat(postId);
  return toDomain(dto);
}

export async function createPostStat(postId: string): Promise<void> {
  await PostStatRespository.createPostStat(postId);
}

export async function deletePostStat(postId: string): Promise<void> {
  await PostStatRespository.deletePostStat(postId);
}

export async function incrementLikeCount(postId: string): Promise<PostStat> {
  const dto = await PostStatRespository.incrementLikeCount(postId);
  return toDomain(dto);
}

export async function incrementViewCount(postId: string): Promise<PostStat> {
  const dto = await PostStatRespository.incrementViewCount(postId);
  return toDomain(dto);
}
