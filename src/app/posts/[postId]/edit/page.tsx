import EditPageClient from '@/components/edit/editPageClient';
import { fetchPost } from '@/features/post/domain/service/postServerService';
import { createProps } from '@/features/post/ui/postProps';

export default async function EditPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;
  const post = await fetchPost(postId).then(createProps);

  return <EditPageClient post={post} />;
}
