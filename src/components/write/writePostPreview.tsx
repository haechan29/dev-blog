'use client';

export default function WritePostPreview({ content }: { content: string }) {
  return (
    <div className='w-full min-h-screen border border-gray-200 rounded-lg bg-white'>
      <div className='p-3 border-b border-gray-200 font-semibold text-sm text-gray-600'>
        미리보기
      </div>
      <div className='p-4 prose max-w-none'>
        {content || (
          <p className='text-gray-400'>본문을 입력하면 미리보기가 표시됩니다</p>
        )}
      </div>
    </div>
  );
}
