import { PostDto } from '@/features/post/data/dto/postDto';
import Post from '@/features/post/domain/model/post';
import { api } from '@/lib/api';

export async function getPost(postId: string): Promise<PostDto> {
  const response = await api.get(`/api/posts/${postId}`);
  return response.data;
}

export async function getFeedPosts(
  cursor: string | null,
  excludeId?: string
): Promise<{
  posts: PostDto[];
  nextCursor: string | null;
}> {
  const params = new URLSearchParams({
    type: 'feed',
    ...(cursor && { cursor }),
    ...(excludeId && { excludeId }),
  });

  const response = await api.get(`/api/posts?${params}`);
  return response.data;
}

export async function getPosts(userId: string): Promise<PostDto[]> {
  const response = await api.get(`/api/posts?userId=${userId}`);
  return response.data;
}

export async function createPost(requestDto: {
  title: string;
  content: string;
  tags: string[];
  password: string;
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
  content?: string;
  tags?: string[];
  password?: string;
  seriesId?: string | null;
  seriesOrder?: number | null;
}): Promise<PostDto> {
  const response = await api.patch(`/api/posts/${postId}`, requestBody);
  return response.data;
}

export async function updatePostsInSeries(
  posts: Pick<Post, 'id' | 'seriesId' | 'seriesOrder'>[]
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
