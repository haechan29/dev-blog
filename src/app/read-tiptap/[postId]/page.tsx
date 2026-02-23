import TiptapRenderer from '@/components/tiptap/renderer/tiptapRenderer';
import * as PostServerService from '@/features/post/domain/service/postServerService';
import { notFound } from 'next/navigation';

export default async function ReadTiptapPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;

  const post = await PostServerService.getPost(postId);

  if (!post?.contentJson) {
    notFound();
  }

  return (
    <div className='max-w-3xl mx-auto p-4'>
      <TiptapRenderer content={post.contentJson} />
    </div>
  );
}
