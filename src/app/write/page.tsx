import WritePostEditorWithPreview from '@/components/write/writePostEditorWithPreview';
import WritePostPassword from '@/components/write/writePostPassword';
import WritePostTag from '@/components/write/writePostTag';
import WritePostTitle from '@/components/write/writePostTitle';
import WritePostToolbar from '@/components/write/writePostToolbar';

export default function WritePage() {
  return (
    <div>
      <WritePostToolbar />
      <WritePostTitle />
      <WritePostTag />
      <WritePostPassword />
      <WritePostEditorWithPreview />
    </div>
  );
}
