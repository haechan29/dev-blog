import EditPageClient from '@/components/edit/editPageClient';
import { fetchPost } from '@/features/post/domain/service/postServerService';
import { createProps } from '@/features/post/ui/postProps';
import { getUserId } from '@/lib/user';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

export default async function EditPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const userId = await getUserId();

  const { postId } = await params;
  const post = await fetchPost(postId).then(createProps);

  if (post.userId !== userId) {
    redirect('/');
  }

  return (
    <Suspense>
      <EditPageClient userId={userId} post={post} />
    </Suspense>
  );
}
