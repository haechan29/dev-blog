import HomeToolbar from '@/components/home/homeToolbar';
import PostToolbar from '@/components/post/postToolbar';
import Link from 'next/link';

export default function ForbiddenPostPage({
  isLoggedIn,
}: {
  isLoggedIn: boolean;
}) {
  return (
    <>
      <HomeToolbar isLoggedIn={isLoggedIn} className='max-xl:hidden' />
      <PostToolbar className='xl:hidden' />

      <div className='h-screen pt-(--toolbar-height) flex flex-col items-center justify-center text-center'>
        <div className='text-2xl font-bold'>비공개 글입니다</div>
        <div className='mt-2 text-gray-600'>
          이 글은 작성자만 볼 수 있도록 설정되어 있습니다.
        </div>

        <Link
          href='/'
          className='mt-6 rounded px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 cursor-pointer'
        >
          홈으로 돌아가기
        </Link>
      </div>
    </>
  );
}
