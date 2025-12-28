'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { ApiError } from '@/errors/errors';
import useComments from '@/features/comment/hooks/useComments';
import clsx from 'clsx';
import { Loader2, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function DeleteCommentDialog({
  isLoggedIn,
  postId,
  commentId,
  isOpen,
  setIsOpen,
}: {
  isLoggedIn: boolean;
  postId: string;
  commentId: number;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const [password, setPassword] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(true);

  useEffect(() => {
    if (!isOpen) {
      setPassword('');
      setIsPasswordValid(true);
    }
  }, [isOpen]);

  const { deleteCommentMutation } = useComments({ postId });
  const deleteComment = useCallback(
    (params: { postId: string; commentId: number; password?: string }) => {
      deleteCommentMutation.mutate(params, {
        onSuccess: () => {
          setIsOpen(false);
          toast.success('댓글이 삭제되었습니다');
        },
        onError: error => {
          const message =
            error instanceof ApiError
              ? error.message
              : '댓글 삭제에 실패했습니다';
          toast.error(message);
        },
      });
    },
    [deleteCommentMutation, setIsOpen]
  );

  const handleDelete = useCallback(() => {
    if (!isLoggedIn && !password.trim()) {
      setIsPasswordValid(false);
      return;
    }

    deleteComment({
      postId,
      commentId,
      ...(!isLoggedIn && { password: password!.trim() }),
    });
  }, [commentId, deleteComment, isLoggedIn, password, postId]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent showCloseButton={false} className='gap-0 rounded-sm'>
        <DialogTitle className='sr-only'>{'댓글 삭제 다이어로그'}</DialogTitle>
        <DialogDescription className='sr-only'>
          선택한 댓글을 삭제하기 위해 비밀번호를 입력해주세요.
        </DialogDescription>
        <div className='text-xl font-bold mt-2 mb-1'>댓글 삭제</div>
        <div className='text-sm text-gray-500 mb-6'>
          정말로 댓글을 삭제할까요?
        </div>

        {!isLoggedIn && (
          <input
            className={clsx(
              'w-full border p-3 mb-8 rounded-sm outline-none',
              isPasswordValid
                ? 'border-gray-200 hover:border-blue-500 focus:border-blue-500'
                : 'border-red-400 animate-shake',
              password ? 'bg-white' : 'bg-gray-50'
            )}
            type='password'
            value={password}
            onChange={e => {
              setPassword(e.target.value);
              setIsPasswordValid(true);
            }}
            placeholder='비밀번호를 입력하세요'
          />
        )}

        <div className='flex justify-between items-center'>
          <button
            className={clsx(
              'flex justify-center items-center px-6 h-10 rounded-sm font-bold text-white hover:bg-red-400',
              deleteCommentMutation.isPending ? 'bg-red-400' : 'bg-red-600'
            )}
            onClick={handleDelete}
            disabled={deleteCommentMutation.isPending}
          >
            {deleteCommentMutation.isPending ? (
              <Loader2 size={18} strokeWidth={3} className='animate-spin' />
            ) : (
              '삭제'
            )}
          </button>
          <DialogClose asChild>
            <X className='w-10 h-10 p-2 cursor-pointer' />
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
