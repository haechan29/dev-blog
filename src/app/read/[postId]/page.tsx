import { auth } from '@/auth';
import ForbiddenPostPage from '@/components/post/forbiddenPostPage';
import PostPageClient from '@/components/post/postPageClient';
import * as CommentServerService from '@/features/comment/domain/service/commentServerService';
import * as CreatorServerRepository from '@/features/creator/data/repository/creatorServerRepository';
import { PostForbiddenError } from '@/features/post/data/errors/postErrors';
import * as PostServerService from '@/features/post/domain/service/postServerService';
import { createProps } from '@/features/post/ui/postProps';
import { Metadata } from 'next';
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
  const timestamp = new Date().toISOString();

  try {
    const [post, commentsPage, postsPage, creator] = await Promise.all([
      PostServerService.getPost(postId).then(createProps),
      CommentServerService.getRankedComments({
        postId,
        userId,
        timestamp,
      }).then(page => ({
        comments: page.comments.map(comment => comment.toProps()),
        nextCursor: page.nextCursor,
      })),
      PostServerService.getFeedPosts({
        cursor: null,
        userId,
        excludeId: postId,
      }).then(page => ({
        posts: page.posts.map(createProps),
        nextCursor: page.nextCursor,
      })),
      userId ? CreatorServerRepository.getCreatorByUserId(userId) : null,
    ]);

    return (
      <PostPageClient
        isLoggedIn={!!session}
        isCreator={!!creator}
        userId={userId}
        initialPost={post}
        initialCommentsPage={commentsPage}
        initialPostsPage={postsPage}
        initialTimestamp={timestamp}
      />
    );
  } catch (error) {
    if (error instanceof PostForbiddenError) {
      return <ForbiddenPostPage isLoggedIn={!!session} />;
    }
    throw error;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ postId: string }>;
}): Promise<Metadata> {
  const { postId } = await params;

  try {
    const post = await PostServerService.getPost(postId);
    const postProps = createProps(post);

    const description = postProps.preview;
    const url = `https://sharetext.app/read/${postId}`;

    return {
      title: postProps.title,
      description,
      keywords: postProps.tags,
      authors: [{ name: postProps.authorName }],
      openGraph: {
        title: postProps.title,
        description,
        url,
        type: 'article',
        publishedTime: post.createdAt,
        authors: [postProps.authorName],
        tags: postProps.tags,
      },
      twitter: {
        card: 'summary',
        title: postProps.title,
        description,
      },
    };
  } catch {
    return {
      title: '셰어텍스트',
    };
  }
}
