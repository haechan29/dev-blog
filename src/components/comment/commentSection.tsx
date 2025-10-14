import CommentSectionClient from '@/components/comment/commentSectionClient';
import { getComments } from '@/features/comment/domain/service/commentService';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

export default async function CommentSection({ postId }: { postId: string }) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['posts', postId, 'comments'],
    queryFn: async () => {
      const comments = await getComments(postId);
      return comments.map(comment => comment.toProps());
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CommentSectionClient postId={postId} />
    </HydrationBoundary>
  );
}
