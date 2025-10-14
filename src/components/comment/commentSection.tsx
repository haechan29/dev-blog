import CommentSectionClient from '@/components/comment/commentSectionClient';
import { getComments } from '@/features/comment/domain/service/commentService';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

export default async function CommentSection({ id }: { id: string }) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['posts', id, 'comments'],
    queryFn: async () => {
      const comments = await getComments(id);
      return comments.map(comment => comment.toProps());
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CommentSectionClient postId={id} />
    </HydrationBoundary>
  );
}
