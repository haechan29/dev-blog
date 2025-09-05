import * as PostStatRespository from '@/features/postStat/data/repository/postStatRepository';
import toDomain from '@/features/postStat/domain/mapper/postStatMapper';

export async function fetchPostStat(postId: string) {
  const dto = await PostStatRespository.fetchPostStat(postId);
  return toDomain(dto);
}

export async function createPostStat(postId: string): Promise<void> {
  await PostStatRespository.createPostStat(postId);
}

export async function deletePostStat(postId: string): Promise<void> {
  await PostStatRespository.deletePostStat(postId);
}
