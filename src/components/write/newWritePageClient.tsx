'use client';

import TiptapEditor from '@/components/tiptap/editor/tiptapEditor';
import ProfileIcon from '@/components/user/profileIcon';
import NewWriteToolbar from '@/components/write/newWriteToolbar';
import PublishDialog from '@/components/write/publishDialog';
import TableOfContents, { TocAnchor } from '@/components/write/tableOfContents';
import TagInput from '@/components/write/tagInput';
import { PostVisibility } from '@/features/post/domain/types/postVisibility';
import useUser from '@/features/user/domain/hooks/useUser';
import { UserProps } from '@/features/user/ui/userProps';
import clsx from 'clsx';
import { Heart } from 'lucide-react';
import { useState } from 'react';

export default function NewWritePageClient({
  skipPasswordInput,
}: {
  skipPasswordInput: boolean;
}) {
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [anchors, setAnchors] = useState<TocAnchor[]>([]);
  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const { user } = useUser();

  const handleNext = () => {
    setIsPublishDialogOpen(true);
  };

  const handlePublish = async (data: {
    visibility: PostVisibility;
    password: string;
  }) => {
    setIsPending(true);
    try {
      // TODO: 발행 API 호출
      console.log('발행', { title, tags, ...data });
      // await publishPost({ title, tags, content, ...data });

      setIsPublishDialogOpen(false);
      // 발행 후 리다이렉트 등 처리
    } catch (error) {
      console.error('발행 실패', error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <NewWriteToolbar onNext={handleNext} isPending={isPending} />

      <div className='fixed top-0 left-0 w-(--sidebar-width) h-full max-xl:hidden' />

      <div className='fixed top-0 right-0 w-(--toc-width) mr-(--toc-margin) h-full max-xl:hidden'>
        <TableOfContents anchors={anchors} showPlaceholder />
      </div>

      <div
        className={clsx(
          'mt-(--toolbar-height) mb-12 px-6 md:px-12 xl:px-18',
          'xl:ml-(--sidebar-width)',
          'xl:mr-[calc(var(--toc-width)+var(--toc-margin))]'
        )}
      >
        <div className='max-w-[65ch] mx-auto'>
          <div data-post-header className='flex flex-col gap-6 mb-10'>
            <textarea
              value={title}
              onChange={e => {
                setTitle(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
              }}
              placeholder='제목'
              rows={1}
              className='w-full text-3xl font-bold outline-none resize-none scrollbar-hide placeholder:text-gray-400'
            />

            <TagInput tags={tags} onChange={setTags} />

            <div className='flex gap-2 items-center text-xs'>
              <ProfileIcon
                nickname={user?.nickname ?? ''}
                size='sm'
                profileImageUrl={user?.profileImageUrl ?? undefined}
              />
              <span className='text-gray-900'>{user?.nickname}</span>
              <div className='w-[3px] h-[3px] rounded-full bg-gray-400' />
              <span className='text-gray-500'>방금 전</span>
            </div>
          </div>

          <div className='w-full h-px bg-gray-200 mb-10' />

          <TiptapEditor onAnchorsChange={setAnchors} className='mb-20' />

          <LikeButtonPreview />
          <AuthorProfilePreview user={user ?? null} />
          <CommentsPreview />
        </div>
      </div>

      <PublishDialog
        isOpen={isPublishDialogOpen}
        onClose={() => setIsPublishDialogOpen(false)}
        onPublish={handlePublish}
        skipPasswordInput={skipPasswordInput}
        isPending={isPending}
      />
    </>
  );
}

function LikeButtonPreview() {
  return (
    <div className='flex justify-center mb-20 pointer-events-none'>
      <div className='flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200'>
        <Heart size={20} className='text-gray-400' />
        <div className='text-sm text-gray-600'>0</div>
      </div>
    </div>
  );
}

function AuthorProfilePreview({ user }: { user: UserProps | null }) {
  return (
    <div className='flex items-center gap-3 mb-12 pointer-events-none'>
      <ProfileIcon
        nickname={user?.nickname ?? ''}
        size='md'
        profileImageUrl={user?.profileImageUrl ?? undefined}
      />
      <div className='flex-1 min-w-0'>
        <div className='font-medium text-gray-900 truncate'>
          {user?.nickname}
        </div>
        {user?.bio && (
          <div className='text-xs text-gray-500 truncate'>{user.bio}</div>
        )}
      </div>
    </div>
  );
}

function CommentsPreview() {
  return (
    <div className='w-full p-4 mb-12 bg-gray-50 rounded-lg text-left pointer-events-none'>
      <div className='mb-2 text-sm font-medium text-gray-700'>댓글 0개</div>
      <div className='text-sm text-gray-500'>첫 번째 댓글을 작성해보세요</div>
    </div>
  );
}
