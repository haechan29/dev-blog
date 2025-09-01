import CommentSectionClient from '@/components/commentSectionClient';
import { getComments } from '@/features/comment/domain/service/commentService';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

export default async function CommentSection({ slug }: { slug: string }) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['comments', slug],
    queryFn: () => getComments(slug),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CommentSectionClient slug={slug} />
    </HydrationBoundary>
  );
}
