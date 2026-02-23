import TiptapEditor from '@/components/tiptap/editor/tiptapEditor';
import * as PostServerService from '@/features/post/domain/service/postServerService';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ postId: string }>;
}

export default async function EditTiptapPage({ params }: Props) {
  const { postId } = await params;

  const post = await PostServerService.getPost(postId);

  if (!post) {
    notFound();
  }

  return (
    <div className='h-screen p-4'>
      <h1 className='text-xl font-bold mb-4'>Tiptap 에디터 수정</h1>
      <div className='h-[calc(100%-3rem)]'>
        <TiptapEditor initialContent={post.contentJson ?? undefined} />
      </div>
    </div>
  );
}
