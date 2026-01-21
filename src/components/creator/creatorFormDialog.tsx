'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import * as CreatorAction from '@/features/creator/domain/action/creatorAction';
import { Creator } from '@/features/creator/domain/model/creator';
import { Loader2, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

type Mode = 'create' | 'edit';

export function CreatorFormDialog({
  mode,
  creator,
  isOpen,
  setIsOpen,
  onSuccess,
}: {
  mode: Mode;
  creator?: Creator | null;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSuccess: (creator: Creator) => void;
}) {
  const [channelName, setChannelName] = useState('');
  const [email, setEmail] = useState('');
  const [memo, setMemo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && mode === 'edit' && creator) {
      setChannelName(creator.channelName);
      setEmail(creator.email);
      setMemo(creator.memo ?? '');
    } else if (!isOpen) {
      setChannelName('');
      setEmail('');
      setMemo('');
    }
  }, [isOpen, mode, creator]);

  const handleSubmit = useCallback(async () => {
    if (!channelName.trim() || !email.trim()) {
      toast.error('채널명과 이메일은 필수입니다');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.set('channelName', channelName.trim());
      formData.set('email', email.trim());
      formData.set('memo', memo.trim());

      const result =
        mode === 'create'
          ? await CreatorAction.createCreator(formData)
          : await CreatorAction.updateCreator(creator!.id, formData);

      onSuccess(result);
      setIsOpen(false);
      toast.success(mode === 'create' ? '등록되었습니다' : '수정되었습니다');
    } catch (error) {
      console.error(error);
      toast.error(
        mode === 'create' ? '등록에 실패했습니다' : '수정에 실패했습니다'
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [channelName, email, memo, mode, creator, onSuccess, setIsOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent showCloseButton={false} className='gap-0 rounded-sm'>
        <DialogTitle className='sr-only'>
          {mode === 'create' ? '크리에이터 등록' : '크리에이터 수정'}
        </DialogTitle>
        <DialogDescription className='sr-only'>
          크리에이터 정보를 입력해주세요.
        </DialogDescription>

        <div className='text-xl font-bold mt-2 mb-6'>
          {mode === 'create' ? '크리에이터 등록' : '크리에이터 수정'}
        </div>

        <div className='space-y-4 mb-8'>
          <input
            type='text'
            value={channelName}
            onChange={e => setChannelName(e.target.value)}
            placeholder='채널명'
            className='w-full border border-gray-200 p-3 rounded-sm outline-none hover:border-blue-500 focus:border-blue-500'
          />
          <input
            type='email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder='이메일'
            className='w-full border border-gray-200 p-3 rounded-sm outline-none hover:border-blue-500 focus:border-blue-500'
          />
          <textarea
            value={memo}
            onChange={e => setMemo(e.target.value)}
            placeholder='메모 (선택)'
            rows={3}
            className='w-full border border-gray-200 p-3 rounded-sm outline-none hover:border-blue-500 focus:border-blue-500 resize-none'
          />
        </div>

        <div className='flex justify-between items-center'>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className='flex justify-center items-center px-6 h-10 rounded-sm font-bold text-white bg-blue-500 hover:bg-blue-400 disabled:bg-blue-400'
          >
            {isSubmitting ? (
              <Loader2 size={18} strokeWidth={3} className='animate-spin' />
            ) : mode === 'create' ? (
              '등록'
            ) : (
              '수정'
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
