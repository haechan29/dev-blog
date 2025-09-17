import CommentSectionClient from '@/components/comment/commentSectionClient';
import { getComments } from '@/features/comment/domain/service/commentService';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

export default async function CommentSection({ slug }: { slug: string }) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['posts', slug, 'comments'],
    queryFn: async () => {
      const comments = await getComments(slug);
      return comments.map(comment => comment.toProps());
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CommentSectionClient slug={slug} />
    </HydrationBoundary>
  );
}
