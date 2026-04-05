'use client';

import CommentItem from '@/components/comment/commentItem';
import CommentPanel from '@/components/comment/commentPanel';
import CommentPasswordDialog from '@/components/comment/commentPasswordDialog';
import ProfileIcon from '@/components/user/profileIcon';
import { ApiError } from '@/errors/errors';
import * as CommentClientService from '@/features/comment/domain/service/commentClientService';
import {
  CommentCursor,
  CommentsPage,
} from '@/features/comment/domain/types/page';
import { PostProps } from '@/features/post/ui/postProps';
import useMediaQuery, {
  DESKTOP_QUERY,
  TOUCH_QUERY,
} from '@/hooks/useMediaQuery';
import { postKeys } from '@/queries/keys';
import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import clsx from 'clsx';
import { Loader2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useInView } from 'react-intersection-observer';
import SimpleBar from 'simplebar-react';

export default function Comments({
  isLoggedIn,
  userId,
  postId,
  initialCommentsPage,
  initialTimestamp,
  commentCount,
  highlightCommentId,
}: {
  isLoggedIn: boolean;
  userId?: string;
  postId: string;
  initialCommentsPage: CommentsPage;
  initialTimestamp: string;
  commentCount: number;
  highlightCommentId?: number;
}) {
  const queryClient = useQueryClient();

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const commentsPreviewRef = useRef<HTMLButtonElement | null>(null);
  const commentsListRef = useRef<HTMLDivElement | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(
    highlightCommentId !== undefined
  );
  const [content, setContent] = useState('');
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

  const isDesktop = useMediaQuery(DESKTOP_QUERY);
  const isTouch = useMediaQuery(TOUCH_QUERY);
  const showSheet = isDesktop && !isTouch;

  const { ref: loadMoreRef, inView } = useInView();

  const {
    data: { pages },
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: postKeys.comments(postId, highlightCommentId),
    queryFn: async ({ pageParam }) => {
      const page = await CommentClientService.getRankedComments({
        postId,
        timestamp: initialTimestamp,
        cursor: pageParam,
        highlightCommentId,
      });
      return {
        comments: page.comments.map(comment => comment.toProps()),
        nextCursor: page.nextCursor,
      };
    },
    initialPageParam: null as CommentCursor | null,
    getNextPageParam: lastPage => lastPage.nextCursor,
    initialData: {
      pages: [initialCommentsPage],
      pageParams: [null],
    },
  });

  const comments = useMemo(() => {
    const flat = pages.flatMap(page => page.comments);
    if (highlightCommentId == null) return flat;
    const seen = new Set<number>();
    return flat.filter(c => {
      if (seen.has(c.id)) return false;
      seen.add(c.id);
      return true;
    });
  }, [pages, highlightCommentId]);

  const representativeComment = comments.length === 0 ? null : comments[0];

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const createCommentMutation = useMutation({
    mutationFn: (params: {
      postId: string;
      content: string;
      password?: string;
    }) => CommentClientService.createComment(params),
    onSuccess: newComment => {
      queryClient.setQueryData(
        postKeys.comments(postId, highlightCommentId),
        (old: InfiniteData<CommentsPage> | undefined) => {
          if (!old) return old;
          const newProps = newComment.toProps();
          return {
            ...old,
            pages: old.pages.map((page, i) =>
              i === 0
                ? { ...page, comments: [newProps, ...page.comments] }
                : page
            ),
          };
        }
      );

      queryClient.setQueryData(
        postKeys.detail(postId),
        (old: PostProps | undefined) => {
          if (!old) return old;
          return {
            ...old,
            commentCount: old.commentCount + 1,
          };
        }
      );
    },
  });

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
          {`댓글 ${commentCount}개`}
        </div>
        {representativeComment ? (
          <div className='flex gap-3'>
            <ProfileIcon
              nickname={representativeComment.authorName}
              size='sm'
              profileImageUrl={representativeComment.profileImageUrl}
            />
            <div className='flex-1 min-w-0 text-sm text-gray-600 line-clamp-3'>
              {representativeComment.content}
            </div>
          </div>
        ) : (
          <div className='text-sm text-gray-500'>
            첫 번째 댓글을 작성해보세요
          </div>
        )}
      </button>

      <CommentPanel
        open={isPanelOpen}
        onOpenChange={setIsPanelOpen}
        showSheet={showSheet}
        title={`댓글 ${commentCount}개`}
        onClickWrite={handleClickWrite}
        onInteractOutside={e => {
          if (commentsPreviewRef.current?.contains(e.target as Node)) {
            e.preventDefault();
          }
        }}
      >
        <>
          <div className='flex-1 min-h-0 overflow-hidden'>
            {commentCount === 0 ? (
              <div className='h-full flex items-center justify-center bg-gray-50 text-gray-500 text-sm'>
                아직 댓글이 없습니다
              </div>
            ) : (
              <SimpleBar
                scrollableNodeProps={{ ref: commentsListRef }}
                className='h-full simplebar-hover'
              >
                <div className='flex flex-col'>
                  {comments.map((comment, idx) => (
                    <div key={comment.id}>
                      <CommentItem
                        isLoggedIn={isLoggedIn}
                        userId={userId}
                        comment={comment}
                        highlightCommentId={highlightCommentId}
                      />
                      {idx !== comments.length - 1 && (
                        <div className='w-full h-px bg-gray-200' />
                      )}
                    </div>
                  ))}
                  <div ref={loadMoreRef} className='h-px shrink-0' />
                  {isFetchingNextPage && (
                    <div className='flex justify-center py-4'>
                      <Loader2
                        strokeWidth={3}
                        className='animate-spin text-gray-400'
                      />
                    </div>
                  )}
                </div>
              </SimpleBar>
            )}
          </div>

          {showSheet ? (
            <div className='flex gap-3 items-end border-t border-gray-200 p-4'>
              <textarea
                ref={textareaRef}
                value={content}
                onChange={e => setContent(e.target.value)}
                onInput={e => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = `${target.scrollHeight}px`;
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
                disabled={createCommentMutation.isPending}
                className={clsx(
                  'shrink-0 text-sm font-medium text-white px-4 rounded-full',
                  'h-9 flex items-center justify-center bg-blue-600',
                  content.trim() && !createCommentMutation.isPending
                    ? 'hover:bg-blue-500 cursor-pointer'
                    : 'opacity-50'
                )}
              >
                {createCommentMutation.isPending ? (
                  <Loader2 size={16} className='animate-spin' />
                ) : (
                  '완료'
                )}
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
                      'max-h-36 flex-1 min-w-0 p-3 outline-none resize-none border rounded-lg scrollbar-hide',
                      'border-gray-200 hover:border-blue-500 focus:border-blue-500',
                      !content && 'bg-gray-50'
                    )}
                    rows={1}
                    onInput={e => {
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = 'auto';
                      target.style.height = `${target.scrollHeight}px`;
                    }}
                  />

                  <button
                    onMouseDown={e => e.preventDefault()} // prevent keyboard from closing
                    onTouchStart={e => e.preventDefault()} // prevent keyboard from closing
                    onClick={() => {
                      if (!content.trim()) return;
                      handleSubmit();
                    }}
                    disabled={createCommentMutation.isPending}
                    className={clsx(
                      'shrink-0 text-sm font-medium text-white px-4 rounded-full',
                      'h-9 flex items-center justify-center bg-blue-600',
                      content.trim() && !createCommentMutation.isPending
                        ? 'hover:bg-blue-500 cursor-pointer'
                        : 'opacity-50'
                    )}
                  >
                    {createCommentMutation.isPending ? (
                      <Loader2 size={16} className='animate-spin' />
                    ) : (
                      '완료'
                    )}
                  </button>
                </div>
              </div>
            </>
          )}

          <CommentPasswordDialog
            isOpen={isPasswordDialogOpen}
            setIsOpen={setIsPasswordDialogOpen}
            onSubmit={handleSubmit}
            isLoading={createCommentMutation.isPending}
          />
        </>
      </CommentPanel>
    </>
  );
}
