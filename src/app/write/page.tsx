import WritePostEditorWithPreview from '@/components/write/writePostEditorWithPreview';
import WritePostPassword from '@/components/write/writePostPassword';
import WritePostTag from '@/components/write/writePostTag';
import WritePostTitle from '@/components/write/writePostTitle';

export default function WritePage() {
  return (
    <div>
      <WritePostTitle />
      <WritePostTag />
      <WritePostPassword />
    </div>
  );
}
