import * as PostClientService from '@/features/post/domain/service/postClientService';
import { createProps, PostProps } from '@/features/post/ui/postProps';
import { userKeys } from '@/queries/keys';
import { useQuery } from '@tanstack/react-query';

export default function usePosts(userId: string, initialData?: PostProps[]) {
  const { data } = useQuery({
    queryKey: userKeys.posts(userId),
    queryFn: async () => {
      const posts = await PostClientService.getPostsByUserId(userId);
      return posts.map(createProps);
    },
    initialData,
  });

  return { posts: data } as const;
}
