import { auth } from '@/auth';
import CommentsClient from '@/components/comment/commentsClient';
import * as CommentServerService from '@/features/comment/domain/service/commentServerService';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

export default async function Comments({ id: postId }: { id: string }) {
  const session = await auth();
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['posts', postId, 'comments'],
    queryFn: async () => {
      const comments = await CommentServerService.getComments(postId);
      return comments.map(comment => comment.toProps());
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ErrorBoundary fallback={<div></div>}>
        <Suspense>
          <CommentsClient isLoggedIn={!!session} postId={postId} />
        </Suspense>
      </ErrorBoundary>
    </HydrationBoundary>
  );
}
