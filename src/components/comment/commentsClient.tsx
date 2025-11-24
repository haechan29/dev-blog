'use client';

import CommentFormItem from '@/components/comment/commentFormItem';
import CommentItem from '@/components/comment/commentItem';
import useComments from '@/features/comment/hooks/useComments';
import { setAreCommentsVisible } from '@/lib/redux/post/postViewerSlice';
import { AppDispatch } from '@/lib/redux/store';
import { MessageCircle } from 'lucide-react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

export default function CommentsClient({ postId }: { postId: string }) {
  const dispatch = useDispatch<AppDispatch>();
  const { comments } = useComments({ postId });

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
    <div data-post-comments>
      <div className='text-xl font-bold text-gray-900 mb-8'>
        {`댓글 ${comments.length}개`}
      </div>
      <CommentFormItem postId={postId} />
      <div className='space-y-6'>
        {comments.length === 0 ? (
          <div className='text-center py-12'>
            <MessageCircle className='mx-auto text-gray-300 mb-4' size={48} />
            <p className='text-gray-500 text-lg'>아직 댓글이 없습니다.</p>
            <p className='text-gray-400'>첫 번째 댓글을 작성해보세요!</p>
          </div>
        ) : (
          comments.map(comment => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        )}
      </div>
    </div>
  );
}
