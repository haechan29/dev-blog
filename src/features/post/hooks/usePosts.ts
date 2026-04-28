import * as PostClientRepository from '@/features/post/data/repository/postClientRepository';
import { createProps, PostProps } from '@/features/post/ui/postProps';
import { userKeys } from '@/queries/keys';
import { useQuery } from '@tanstack/react-query';

export default function usePosts(userId: string, initialData?: PostProps[]) {
  const { data } = useQuery({
    queryKey: userKeys.posts(userId),
    queryFn: async () => {
      const posts = await PostClientRepository.getPostsByUserId(userId);
      return posts.map(createProps);
    },
    initialData,
  });

  return { posts: data } as const;
}
