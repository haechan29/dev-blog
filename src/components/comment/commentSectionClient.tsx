'use client';

import CommentFormItem from '@/components/comment/commentFormItem';
import CommentItem from '@/components/comment/commentItem';
import CommentSectionDetector from '@/components/comment/commentSectionDetector';
import { getComments } from '@/features/comment/domain/service/commentService';
import { useSuspenseQuery } from '@tanstack/react-query';
import { MessageCircle } from 'lucide-react';
import { useRef } from 'react';

export default function CommentSectionClient({ slug }: { slug: string }) {
  const commentSectionRef = useRef<HTMLDivElement | null>(null);

  const { data: comments } = useSuspenseQuery({
    queryKey: ['posts', slug, 'comments'],
    queryFn: async () => {
      const comments = await getComments(slug);
      return comments.map(comment => comment.toProps());
    },
  });

  return (
    <div ref={commentSectionRef}>
      <CommentSectionDetector commentSectionRef={commentSectionRef} />

      <div className='text-xl font-bold text-gray-900 mb-8'>
        댓글 {comments.length}개
      </div>
      <CommentFormItem postId={slug} />
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
