import { LockIcon } from '@/components/lockIcon';
import { PostVisibility } from '@/features/post/domain/types/postVisibility';
import { Link2 } from 'lucide-react';

export default function PostVisibilityBanner({
  visibility,
  isAuthor,
}: {
  visibility: PostVisibility;
  isAuthor: boolean;
}) {
  if (visibility === 'public') return null;

  if (visibility === 'private') {
    return (
      <div className='mb-8 px-4 py-3 bg-yellow-50 border border-yellow-100 rounded-lg flex items-center gap-3'>
        <LockIcon className='w-4 h-4 text-yellow-700 shrink-0' />
        <p className='text-sm text-yellow-700'>
          이 글은 비공개로 설정되어 있습니다
        </p>
      </div>
    );
  }

  if (visibility === 'unlisted') {
    return (
      <div className='mb-8 px-4 py-3 bg-blue-50 border border-blue-100 rounded-lg flex items-center gap-3'>
        <Link2 className='w-4 h-4 text-blue-600 shrink-0' />
        <p className='text-sm text-blue-600'>
          {isAuthor
            ? '이 글은 링크를 아는 사람만 볼 수 있습니다'
            : '이 글은 링크를 통해서만 접근할 수 있습니다'}
        </p>
      </div>
    );
  }
}
