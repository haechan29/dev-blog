import { auth } from '@/auth';
import EditPageClient from '@/components/edit/editPageClient';
import { fetchPost } from '@/features/post/domain/service/postServerService';
import { createProps } from '@/features/post/ui/postProps';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

export default async function EditPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const session = await auth();
  const userId = session?.user?.id ?? null;

  const { postId } = await params;
  const post = await fetchPost(postId).then(createProps);

  const canEdit = (!post.userId && !userId) || post.userId === userId;
  if (!canEdit) {
    redirect('/');
  }

  return (
    <Suspense>
      <EditPageClient userId={userId} post={post} />
    </Suspense>
  );
}
