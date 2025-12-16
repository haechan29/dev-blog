import { auth } from '@/auth';
import EditPageClient from '@/components/edit/editPageClient';
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
  const post = await getPost(postId).then(createProps);

  if (post.userId !== userId) {
    redirect('/');
  }

  return (
    <Suspense>
      <EditPageClient isLoggedIn={!!session} post={post} />
    </Suspense>
  );
}
