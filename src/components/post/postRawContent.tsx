export default function PostRawContent({ content }: { content: string }) {
  return (
    <div className='flex flex-col h-full bg-gray-50 border-gray-200 border rounded-lg p-4 whitespace-pre-wrap break-all'>
      {content}
    </div>
  );
}
