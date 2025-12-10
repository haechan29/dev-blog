export const dynamic = 'force-dynamic';

import { auth } from '@/auth';
import PostPageClient from '@/components/post/postPageClient';
import PostParsedContent from '@/components/post/postParsedContent';
import * as CommentServerService from '@/features/comment/domain/service/commentServerService';
import * as PostServerService from '@/features/post/domain/service/postServerService';
import { createProps } from '@/features/post/ui/postProps';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

export default async function PostPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const session = await auth();
  const userId =
    session?.user?.user_id ?? (await cookies()).get('userId')?.value;

  if (!userId) {
    notFound();
  }

  const { postId } = await params;
  const [post, comments] = await Promise.all([
    PostServerService.fetchPost(postId).then(createProps),
    CommentServerService.getComments(postId).then(comments =>
      comments.map(comment => comment.toProps())
    ),
  ]);

  return (
    <PostPageClient
      isLoggedIn={!!session}
      userId={userId}
      initialPost={post}
      initialComments={comments}
      parsedContent={<PostParsedContent content={post.content} />}
    />
  );
}
