// src/app/write-new/page.tsx
'use client';

import TiptapEditor from '@/components/tiptap/editor/tiptapEditor';
import ProfileIcon from '@/components/user/profileIcon';
import TableOfContents, { TocAnchor } from '@/components/write/tableOfContents';
import useUser from '@/features/user/domain/hooks/useUser';
import clsx from 'clsx';
import { useState } from 'react';

export default function WriteNewPage() {
  const [title, setTitle] = useState('');
  const [anchors, setAnchors] = useState<TocAnchor[]>([]);
  const { user } = useUser();

  const handleNext = () => {
    console.log('다음 단계로 이동', { title });
  };

  return (
    <>
      {/* 상단 툴바 */}
      <div className='fixed top-0 left-0 right-0 h-(--toolbar-height) bg-white border-b z-50 flex items-center justify-end px-6'>
        <button
          onClick={handleNext}
          className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
        >
          다음
        </button>
      </div>

      {/* 왼쪽 사이드바 영역 (빈 상태) */}
      <div className='fixed top-0 left-0 w-(--sidebar-width) h-full max-xl:hidden' />

      {/* 오른쪽 목차 영역 */}
      <div className='fixed top-0 right-0 w-(--toc-width) mr-(--toc-margin) h-full max-xl:hidden'>
        <TableOfContents anchors={anchors} showPlaceholder />
      </div>

      {/* 본문 영역 */}
      <div
        className={clsx(
          'mt-(--toolbar-height) mb-12 px-6 md:px-12 xl:px-18',
          'xl:ml-(--sidebar-width)',
          'xl:mr-[calc(var(--toc-width)+var(--toc-margin))]'
        )}
      >
        <div className='max-w-[65ch] mx-auto'>
          {/* 제목 입력 */}
          <textarea
            value={title}
            onChange={e => {
              setTitle(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = e.target.scrollHeight + 'px';
            }}
            placeholder='제목을 입력하세요'
            rows={1}
            className='w-full text-3xl font-bold outline-none mt-8 mb-6 resize-none scrollbar-hide'
          />

          {/* 작성자 프로필 (미리보기) */}
          <div className='flex gap-2 items-center text-xs mb-10'>
            <ProfileIcon
              nickname={user?.nickname ?? ''}
              size='sm'
              profileImageUrl={user?.profileImageUrl ?? undefined}
            />
            <span className='text-gray-900'>{user?.nickname}</span>
            <div className='w-[3px] h-[3px] rounded-full bg-gray-400' />
            <span className='text-gray-500'>방금 전</span>
          </div>

          <div className='w-full h-px bg-gray-200 mb-10' />

          {/* Tiptap 에디터 */}
          <div className='mb-20'>
            <TiptapEditor onAnchorsChange={setAnchors} />
          </div>
        </div>
      </div>
    </>
  );
}
