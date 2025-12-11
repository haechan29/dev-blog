import * as PostClientService from '@/features/post/domain/service/postClientService';
import { createProps } from '@/features/post/ui/postProps';
import { useQuery } from '@tanstack/react-query';

export default function usePosts(userId: string) {
  const { data } = useQuery({
    queryKey: ['user', userId, 'posts'],
    queryFn: async () => {
      const posts = await PostClientService.fetchPosts(userId);
      return posts.map(createProps);
    },
  });

  return { posts: data } as const;
}
