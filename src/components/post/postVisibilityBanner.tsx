import { Lock } from 'lucide-react';

export default function PostVisibilityBanner() {
  return (
    <div className='mb-8 px-4 py-3 bg-yellow-50 border border-yellow-100 rounded-lg flex items-center gap-3'>
      <Lock className='w-4 h-4 text-yellow-700 shrink-0' />
      <p className='text-sm text-yellow-700'>
        이 글은 비공개로 설정되어 있습니다
      </p>
    </div>
  );
}
