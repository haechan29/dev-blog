import Link from 'next/link';

export default function UserNotFound() {
  return (
    <div className='h-[calc(100vh-var(--toolbar-height)-5rem)] flex flex-col items-center justify-center text-center'>
      <div className='text-2xl font-bold'>사용자를 찾을 수 없습니다</div>
      <div className='mt-2 text-gray-600'>
        존재하지 않거나 탈퇴한 사용자입니다.
      </div>

      <Link
        href='/'
        className='mt-6 rounded px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 cursor-pointer'
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
