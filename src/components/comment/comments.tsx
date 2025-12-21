'use client';

import CommentItem from '@/components/comment/commentItem';
import CommentPanel from '@/components/comment/commentPanel';
import CommentPasswordDialog from '@/components/comment/commentPasswordDialog';
import ProfileIcon from '@/components/user/profileIcon';
import useComments from '@/features/comment/hooks/useComments';
import { CommentItemProps } from '@/features/comment/ui/commentItemProps';
import useMediaQuery, {
  DESKTOP_QUERY,
  TOUCH_QUERY,
} from '@/hooks/useMediaQuery';
import { ApiError } from '@/lib/api';
import { remToPx } from '@/lib/dom';
import clsx from 'clsx';
import { useCallback, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';

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
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const commentsPreviewRef = useRef<HTMLButtonElement | null>(null);
  const commentsListRef = useRef<HTMLDivElement | null>(null);
  const { comments, createCommentMutation } = useComments({
    postId,
    initialComments,
  });
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [content, setContent] = useState('');
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

  const isDesktop = useMediaQuery(DESKTOP_QUERY);
  const isTouch = useMediaQuery(TOUCH_QUERY);
  const showSheet = isDesktop && !isTouch;

  const handleClickWrite = () => {
    setIsInputVisible(true);
    requestAnimationFrame(() => {
      textareaRef.current?.focus();
    });
  };

  const handleSubmit = useCallback(
    (password?: string) => {
      if (!content.trim()) return;

      if (!isLoggedIn && !isPasswordDialogOpen) {
        setIsPasswordDialogOpen(true);
        return;
      }

      createCommentMutation.mutate(
        { postId, content, ...(!isLoggedIn && { password }) },
        {
          onSuccess: () => {
            setContent('');
            setIsInputVisible(false);
            setIsPasswordDialogOpen(false);
            commentsListRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
          },
          onError: error => {
            const message =
              error instanceof ApiError
                ? error.message
                : '댓글 작성에 실패했습니다';
            toast.error(message);
          },
        }
      );
    },
    [content, createCommentMutation, isLoggedIn, isPasswordDialogOpen, postId]
  );

  if (!comments) return null;

  return (
    <>
      <button
        ref={commentsPreviewRef}
        onClick={() => {
          setIsPanelOpen(isPanelOpen => !isPanelOpen);
        }}
        className='w-full p-4 mb-12 bg-gray-50 rounded-lg text-left cursor-pointer hover:bg-gray-100'
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

      <CommentPanel
        open={isPanelOpen}
        onOpenChange={setIsPanelOpen}
        showSheet={showSheet}
        title={`댓글 ${comments.length}개`}
        onClickWrite={handleClickWrite}
        onInteractOutside={e => {
          if (commentsPreviewRef.current?.contains(e.target as Node)) {
            e.preventDefault();
          }
        }}
        comments={
          <div className='flex-1 min-h-0 overflow-hidden'>
            <SimpleBar
              scrollableNodeProps={{ ref: commentsListRef }}
              className='h-full simplebar-hover'
            >
              <div className='flex flex-col'>
                {comments.length === 0 ? (
                  <div className='flex items-center justify-center bg-gray-50 h-full text-gray-500 text-sm'>
                    아직 댓글이 없습니다
                  </div>
                ) : (
                  comments.map((comment, idx) => (
                    <div key={comment.id}>
                      <CommentItem
                        isLoggedIn={isLoggedIn}
                        userId={userId}
                        comment={comment}
                      />
                      {idx !== comments.length - 1 && (
                        <div className='w-full h-px bg-gray-200' />
                      )}
                    </div>
                  ))
                )}
              </div>
            </SimpleBar>
          </div>
        }
        commentInput={
          showSheet ? (
            <div className='flex gap-3 items-end border-t border-gray-200 p-4'>
              <textarea
                ref={textareaRef}
                value={content}
                onChange={e => setContent(e.target.value)}
                onInput={e => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = `${Math.min(
                    target.scrollHeight,
                    remToPx(9)
                  )}px`;
                }}
                placeholder='댓글을 입력하세요'
                className={clsx(
                  'max-h-36 flex-1 min-w-0 p-3 outline-none resize-none border rounded-lg scrollbar-hide',
                  'border-gray-200 hover:border-blue-500 focus:border-blue-500',
                  !content && 'bg-gray-50'
                )}
                rows={1}
              />

              <button
                onMouseDown={e => e.preventDefault()}
                onClick={() => {
                  if (!content.trim()) return;
                  handleSubmit();
                }}
                className={clsx(
                  'shrink-0 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 py-2 px-4 rounded-full',
                  content.trim() ? 'cursor-pointer' : 'opacity-50'
                )}
              >
                완료
              </button>
            </div>
          ) : (
            <>
              {isInputVisible && (
                <div
                  className='fixed inset-0 z-90'
                  onClick={() => {
                    if (createCommentMutation.isPending) return;
                    textareaRef.current?.blur();
                  }}
                  onTouchStart={() => {
                    if (createCommentMutation.isPending) return;
                    textareaRef.current?.blur();
                  }}
                />
              )}

              <div
                className={clsx(
                  'fixed inset-x-0 bottom-0 z-100 bg-white',
                  'transition-transform duration-300 ease-in-out',
                  isInputVisible ? 'translate-y-0' : 'translate-y-full'
                )}
              >
                <div className='flex gap-3 items-end border-t border-gray-200 px-6 py-4'>
                  <textarea
                    ref={textareaRef}
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    onBlur={() => {
                      if (createCommentMutation.isPending) return;
                      setIsInputVisible(false);
                    }}
                    placeholder='댓글을 입력하세요'
                    className={clsx(
                      'max-h-36 flex-1 min-w-0 p-3 outline-none resize-none border rounded-lg',
                      'border-gray-200 hover:border-blue-500 focus:border-blue-500',
                      !content && 'bg-gray-50'
                    )}
                    rows={1}
                    onInput={e => {
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = 'auto';
                      target.style.height = `${Math.min(
                        target.scrollHeight,
                        remToPx(9)
                      )}px`;
                    }}
                  />

                  <button
                    onMouseDown={e => e.preventDefault()} // prevent keyboard from closing
                    onTouchStart={e => e.preventDefault()} // prevent keyboard from closing
                    onClick={() => {
                      if (!content.trim()) return;
                      handleSubmit();
                    }}
                    className={clsx(
                      'shrink-0 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 py-2 px-4 rounded-full',
                      content.trim() ? 'cursor-pointer' : 'opacity-50'
                    )}
                  >
                    완료
                  </button>
                </div>
              </div>
            </>
          )
        }
      />

      <CommentPasswordDialog
        isOpen={isPasswordDialogOpen}
        setIsOpen={setIsPasswordDialogOpen}
        onSubmit={handleSubmit}
        isLoading={createCommentMutation.isPending}
      />
    </>
  );
}
