import TiptapEditor from '@/components/tiptap/tiptapEditor';

export default function WriteTiptapPage() {
  return (
    <div className='h-screen p-4'>
      <h1 className='text-xl font-bold mb-4'>Tiptap 에디터 테스트</h1>
      <div className='h-[calc(100%-3rem)]'>
        <TiptapEditor />
      </div>
    </div>
  );
}
