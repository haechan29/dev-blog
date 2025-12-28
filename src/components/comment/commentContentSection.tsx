'use client';

import CommentLikeButton from '@/components/comment/commentLikeButton';
import { ApiError } from '@/errors/errors';
import useComments from '@/features/comment/hooks/useComments';
import { CommentItemProps } from '@/features/comment/ui/commentItemProps';
import clsx from 'clsx';
import { Loader2 } from 'lucide-react';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import toast from 'react-hot-toast';

export default function CommentContentSection({
  comment,
  isLoggedIn,
  isEditing,
  setIsEditing,
}: {
  comment: CommentItemProps;
  isLoggedIn: boolean;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const restLinesRef = useRef<HTMLDivElement>(null);
  const [password, setPassword] = useState('');
  const [content, setContent] = useState(comment.content);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isContentValid, setIsContentValid] = useState(true);
  const { updateCommentMutation } = useComments({ postId: comment.postId });

  const [splitIndex, setSplitIndex] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);

  const [firstTwoLines, restLines] = splitIndex
    ? [comment.content.slice(0, splitIndex), comment.content.slice(splitIndex)]
    : [comment.content, ''];

  useEffect(() => {
    if (!isEditing) {
      setPassword('');
      setContent(comment.content);
      setIsPasswordValid(true);
      setIsContentValid(true);
    }
  }, [isEditing, comment.content]);

  useLayoutEffect(() => {
    if (contentRef.current) {
      const index = getSecondLineEndIndex(contentRef.current);
      setSplitIndex(index);
    }
  }, [comment.content]);

  useLayoutEffect(() => {
    if (!restLinesRef.current) return;
    const restLines = restLinesRef.current;
    setHasOverflow(restLines.scrollWidth > restLines.clientWidth);
  }, [restLines]);

  const updateComment = useCallback(
    (params: {
      postId: string;
      commentId: number;
      content: string;
      password?: string;
    }) => {
      updateCommentMutation.mutate(params, {
        onSuccess: () => {
          setIsEditing(false);
        },
        onError: error => {
          const message =
            error instanceof ApiError
              ? error.message
              : '댓글 수정에 실패했습니다';
          toast.error(message);
        },
      });
    },
    [setIsEditing, updateCommentMutation]
  );

  const handleEdit = useCallback(() => {
    if (!isLoggedIn && !password.trim()) {
      setIsPasswordValid(false);
      setIsContentValid(true);
      return;
    }

    if (!content.trim()) {
      setIsPasswordValid(true);
      setIsContentValid(false);
      return;
    }

    updateComment({
      postId: comment.postId,
      commentId: comment.id,
      content: content.trim(),
      ...(!isLoggedIn && { password: password.trim() }),
    });
  }, [
    comment.id,
    comment.postId,
    content,
    isLoggedIn,
    password,
    updateComment,
  ]);

  return isEditing ? (
    <div className='space-y-3'>
      {!isLoggedIn && (
        <input
          type='password'
          value={password}
          onChange={e => {
            setIsPasswordValid(true);
            setPassword(e.target.value);
          }}
          placeholder='비밀번호'
          className={clsx(
            'w-full p-2 outline-none border rounded-lg',
            isPasswordValid
              ? 'border-gray-200 hover:border-blue-500 focus:border-blue-500'
              : 'border-red-400 animate-shake',
            password ? 'bg-white' : 'bg-gray-50'
          )}
        />
      )}
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder='댓글을 작성해주세요'
        className={clsx(
          'w-full p-3 resize-none outline-none border rounded-lg overflow-y-hidden scrollbar-hide',
          isContentValid
            ? 'border-gray-200 hover:border-blue-500 focus:border-blue-500'
            : 'border-red-400 animate-shake',
          content ? 'bg-white' : 'bg-gray-50'
        )}
        rows={3}
      />
      <div className='flex space-x-2 text-sm'>
        <button
          onClick={handleEdit}
          className={clsx(
            'h-9 flex justify-center items-center px-4 text-white rounded-lg hover:bg-blue-500',
            updateCommentMutation.isPending ? 'bg-blue-500' : 'bg-blue-600'
          )}
        >
          {updateCommentMutation.isPending ? (
            <Loader2 size={18} strokeWidth={2} className='animate-spin' />
          ) : (
            '댓글 수정'
          )}
        </button>
        <button
          onClick={() => setIsEditing(false)}
          className='w-14 h-9 flex justify-center items-center bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300'
        >
          취소
        </button>
      </div>
    </div>
  ) : (
    <>
      <div className='mb-3'>
        <div
          ref={contentRef}
          className='text-gray-800 break-keep wrap-anywhere'
        >
          {isExpanded ? comment.content : firstTwoLines}
        </div>

        {!isExpanded && restLines && (
          <div className='flex items-center gap-2 break-keep wrap-anywhere'>
            <div ref={restLinesRef} className='flex-1 min-w-0 truncate'>
              {restLines}
            </div>

            {hasOverflow && (
              <button
                onClick={() => setIsExpanded(true)}
                className='cursor-pointer text-sm text-gray-500 hover:text-gray-400'
              >
                더보기
              </button>
            )}
          </div>
        )}
      </div>

      <CommentLikeButton comment={comment} />
    </>
  );
}

function getSecondLineEndIndex(element: HTMLElement): number | null {
  const textNode = element.firstChild;
  if (!textNode || textNode.nodeType !== Node.TEXT_NODE) return null;

  const text = textNode.textContent || '';
  if (!text) return null;

  const computedStyle = getComputedStyle(element);
  const lineHeight = parseFloat(computedStyle.lineHeight) + 1;
  const totalHeight = parseFloat(computedStyle.height);

  if (totalHeight <= lineHeight * 2) return null;

  const range = document.createRange();

  let left = 0;
  let right = text.length;
  let result = text.length;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    range.setStart(textNode, 0);
    range.setEnd(textNode, mid);

    const height = range.getBoundingClientRect().height;

    if (height <= lineHeight * 2) {
      result = mid;
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return result;
}
