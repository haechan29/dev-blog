'use client';

import CommentFormItem from '@/components/comment/commentFormItem';
import CommentItem from '@/components/comment/commentItem';
import useComments from '@/features/comment/hooks/useComments';
import useCommentsTracker from '@/features/comment/hooks/useCommentsTracker';
import { MessageCircle } from 'lucide-react';
import { useRef } from 'react';

export default function CommentsClient({ postId }: { postId: string }) {
  const { comments } = useComments({ postId });
  const commentsRef = useRef<HTMLDivElement | null>(null);
  useCommentsTracker({ commentsRef });

  return (
    <div ref={commentsRef}>
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
