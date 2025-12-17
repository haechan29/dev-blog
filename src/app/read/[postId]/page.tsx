export const dynamic = 'force-dynamic';

import { auth } from '@/auth';
import PostPageClient from '@/components/post/postPageClient';
import PostParsedContent from '@/components/post/postParsedContent';
import * as CommentServerService from '@/features/comment/domain/service/commentServerService';
import * as PostServerService from '@/features/post/domain/service/postServerService';
import { createProps } from '@/features/post/ui/postProps';
import { cookies } from 'next/headers';

export default async function PostPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const session = await auth();
  const userId =
    session?.user?.user_id ?? (await cookies()).get('userId')?.value;

  const { postId } = await params;
  const [post, comments, { posts, nextCursor }] = await Promise.all([
    PostServerService.getPost(postId).then(createProps),
    CommentServerService.getComments(postId),
    PostServerService.getFeedPosts(null, userId, postId),
  ]);
  const commentProps = comments.map(comment => comment.toProps());
  const postProps = posts.map(createProps);

  return (
    <PostPageClient
      isLoggedIn={!!session}
      userId={userId}
      initialPost={post}
      initialComments={commentProps}
      initialPosts={postProps}
      initialCursor={nextCursor}
      parsedContent={<PostParsedContent content={post.content} />}
    />
  );
}
