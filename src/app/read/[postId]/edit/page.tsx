import { auth } from '@/auth';
import ForbiddenPostPage from '@/components/post/forbiddenPostPage';
import WritePageClient from '@/components/write/writePageClient';
import * as CreatorServerRepository from '@/features/creator/data/repository/creatorServerRepository';
import * as DraftServerRepository from '@/features/draft/data/repository/draftServerRepository';
import { PostForbiddenError } from '@/features/post/data/errors/postErrors';
import * as PostServerRepository from '@/features/post/data/repository/postServerRepository';
import { createProps } from '@/features/post/ui/postProps';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

export default async function EditPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const session = await auth();
  const userId =
    session?.user?.id ?? (await cookies()).get('userId')?.value;
  const { postId } = await params;

  try {
    const [post, drafts] = await Promise.all([
      PostServerRepository.getPost(postId).then(createProps),
      DraftServerRepository.getDrafts(),
    ]);

    if (post.userId !== userId) {
      redirect('/');
    }

    const isCreator = userId
      ? !!(await CreatorServerRepository.getCreatorByUserId(userId))
      : false;
    const skipPasswordInput = !!session || isCreator;

    return (
      <Suspense>
        <WritePageClient
          skipPasswordInput={skipPasswordInput}
          post={post}
          initialDrafts={drafts}
        />
      </Suspense>
    );
  } catch (error) {
    if (error instanceof PostForbiddenError) {
      return <ForbiddenPostPage isLoggedIn={!!session} />;
    }
    throw error;
  }
}
