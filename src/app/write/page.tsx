'use client';

import WritePostEditorWithPreview from '@/components/write/writePostEditorWithPreview';
import WritePostPassword from '@/components/write/writePostPassword';
import WritePostTag from '@/components/write/writePostTag';
import WritePostTitle from '@/components/write/writePostTitle';
import WritePostToolbar from '@/components/write/writePostToolbar';
import useWritePost from '@/features/write/hooks/useWritePost';

export default function WritePage() {
  const writePost = useWritePost();

  return (
    <div>
      <WritePostToolbar />
      <WritePostTitle {...writePost} />
      <WritePostTag {...writePost} />
      <WritePostPassword {...writePost} />
      <WritePostEditorWithPreview {...writePost} />
    </div>
  );
}
