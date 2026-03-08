import { auth } from '@/auth';
import ForbiddenPostPage from '@/components/post/forbiddenPostPage';
import WritePageClient from '@/components/write/writePageClient';
import * as CreatorServerRepository from '@/features/creator/data/repository/creatorServerRepository';
import { PostForbiddenError } from '@/features/post/data/errors/postErrors';
import { getPost } from '@/features/post/domain/service/postServerService';
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
    session?.user?.user_id ?? (await cookies()).get('userId')?.value;
  const { postId } = await params;

  try {
    const post = await getPost(postId).then(createProps);

    if (post.userId !== userId) {
      redirect('/');
    }

    const isCreator = userId
      ? !!(await CreatorServerRepository.getCreatorByUserId(userId))
      : false;
    const skipPasswordInput = !!session || isCreator;

    return (
      <Suspense>
        <WritePageClient skipPasswordInput={skipPasswordInput} post={post} />
      </Suspense>
    );
  } catch (error) {
    if (error instanceof PostForbiddenError) {
      return <ForbiddenPostPage isLoggedIn={!!session} />;
    }
    throw error;
  }
}
