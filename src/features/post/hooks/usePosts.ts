import * as PostClientService from '@/features/post/domain/service/postClientService';
import { createProps } from '@/features/post/ui/postProps';
import { usersKeys } from '@/queries/keys';
import { useQuery } from '@tanstack/react-query';

export default function usePosts(userId: string) {
  const { data } = useQuery({
    queryKey: usersKeys.posts(userId),
    queryFn: async () => {
      const posts = await PostClientService.getPosts(userId);
      return posts.map(createProps);
    },
  });

  return { posts: data } as const;
}
