'use client';

import CommentForm from '@/components/comment/commentForm';
import CommentItem from '@/components/comment/commentItem';
import CommentsPanel from '@/components/comment/commentsPanel';
import ProfileIcon from '@/components/user/profileIcon';
import useComments from '@/features/comment/hooks/useComments';
import { CommentItemProps } from '@/features/comment/ui/commentItemProps';
import { setAreCommentsVisible } from '@/lib/redux/post/postViewerSlice';
import { AppDispatch } from '@/lib/redux/store';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

export default function Comments({
  isLoggedIn,
  userId,
  postId,
  initialComments,
}: {
  isLoggedIn: boolean;
  userId?: string;
  postId: string;
  initialComments: CommentItemProps[];
}) {
  const dispatch = useDispatch<AppDispatch>();
  const { comments } = useComments({ postId, initialComments });
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  useEffect(() => {
    const commentsObserver = new IntersectionObserver(entries =>
      dispatch(setAreCommentsVisible(entries[0].isIntersecting))
    );
    const comments = document.querySelector('[data-post-comments]');
    if (comments) {
      commentsObserver.observe(comments);
    }
    return () => commentsObserver.disconnect();
  }, [dispatch]);

  return (
    !!comments && (
      <div data-post-comments className='mb-12'>
        <button
          onClick={() => setIsPanelOpen(true)}
          className='w-full p-4 bg-gray-50 rounded-lg text-left cursor-pointer hover:bg-gray-100'
        >
          <div className='mb-2 text-sm font-medium text-gray-700'>
            {`댓글 ${comments.length}개`}
          </div>
          {comments.length === 0 ? (
            <div className='text-sm text-gray-500'>
              첫 번째 댓글을 작성해보세요
            </div>
          ) : (
            <div className='flex gap-3'>
              <ProfileIcon
                nickname={comments[0].authorName}
                isActive={comments[0].userStatus === 'ACTIVE'}
                size='sm'
              />
              <div className='flex-1 min-w-0 text-sm text-gray-600 line-clamp-3'>
                {comments[0].content}
              </div>
            </div>
          )}
        </button>

        <CommentsPanel
          open={isPanelOpen}
          onOpenChange={setIsPanelOpen}
          title={`댓글 ${comments.length}개`}
        >
          <div className='flex flex-col h-full'>
            <div className='p-4'>
              <CommentForm isLoggedIn={isLoggedIn} postId={postId} />
            </div>
            <div className='flex-1 overflow-y-auto p-4 space-y-6'>
              {comments.map(comment => (
                <CommentItem
                  key={comment.id}
                  isLoggedIn={isLoggedIn}
                  userId={userId}
                  comment={comment}
                />
              ))}
            </div>
          </div>
        </CommentsPanel>
      </div>
    )
  );
}
