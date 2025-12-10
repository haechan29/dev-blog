import { auth } from '@/auth';
import CommentsClient from '@/components/comment/commentsClient';
import * as CommentServerService from '@/features/comment/domain/service/commentServerService';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

export default async function Comments({ id: postId }: { id: string }) {
  const session = await auth();
  const userId =
    session?.user?.user_id ?? (await cookies()).get('userId')?.value;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['posts', postId, 'comments'],
    queryFn: async () => {
      const comments = await CommentServerService.getComments(postId);
      return comments.map(comment => comment.toProps());
    },
  });

  if (!userId) {
    notFound();
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ErrorBoundary fallback={<div></div>}>
        <Suspense>
          <CommentsClient
            isLoggedIn={!!session}
            userId={userId}
            postId={postId}
          />
        </Suspense>
      </ErrorBoundary>
    </HydrationBoundary>
  );
}
