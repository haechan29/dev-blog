import { PostDto } from '@/features/post/data/dto/postDto';
import { PostVisibility } from '@/features/post/domain/types/postVisibility';
import { api } from '@/lib/api';

export async function getPost(postId: string): Promise<PostDto> {
  const response = await api.get(`/api/posts/${postId}`);
  return response.data;
}

export async function getFeedPosts({
  cursor,
  excludeId,
  tag,
}: {
  cursor: string | null;
  excludeId?: string;
  tag?: string;
}): Promise<{
  posts: PostDto[];
  nextCursor: string | null;
}> {
  const params = new URLSearchParams({
    type: 'feed',
    ...(cursor && { cursor }),
    ...(excludeId && { excludeId }),
    ...(tag && { tag }),
  });

  const response = await api.get(`/api/posts?${params}`);
  return response.data;
}

export async function getPostsByUserId(userId: string): Promise<PostDto[]> {
  const response = await api.get(`/api/posts?userId=${userId}`);
  return response.data;
}

export async function searchPosts({
  query,
  cursorScore,
  cursorId,
}: {
  query: string;
  cursorScore?: number;
  cursorId?: string;
}): Promise<{
  posts: PostDto[];
  nextCursor: { score: number; id: string } | null;
}> {
  const params = new URLSearchParams({
    type: 'search',
    q: query,
    ...(cursorScore !== undefined && { cursorScore: cursorScore.toString() }),
    ...(cursorId && { cursorId }),
  });

  const response = await api.get(`/api/posts?${params}`);
  return response.data;
}

export async function createPost(requestDto: {
  title: string;
  contentJson: object;
  tags: string[];
  password: string;
  visibility: PostVisibility;
  draftId?: string;
}): Promise<PostDto> {
  const response = await api.post(`/api/posts`, requestDto);
  return response.data;
}

export async function updatePost({
  postId,
  ...requestBody
}: {
  postId: string;
  title?: string;
  contentJson?: object;
  tags?: string[];
  password?: string;
  seriesId?: string | null;
  seriesOrder?: number | null;
  visibility?: PostVisibility;
  draftId?: string;
}): Promise<PostDto> {
  const response = await api.patch(`/api/posts/${postId}`, requestBody);
  return response.data;
}

export async function updatePostsInSeries(
  posts: Pick<PostDto, 'id' | 'seriesId' | 'seriesOrder'>[]
): Promise<void> {
  await api.patch(`/api/posts`, { posts });
}

export async function deletePost(
  postId: string,
  password: string
): Promise<void> {
  await api.delete(`/api/posts/${postId}`, {
    headers: {
      'X-Post-Password': password,
    },
  });
}
