'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import * as CreatorAction from '@/features/creator/domain/action/creatorAction';
import { Loader2, X } from 'lucide-react';
import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';

export function DeleteCreatorDialog({
  creatorId,
  creatorName,
  isOpen,
  setIsOpen,
  onSuccess,
}: {
  creatorId: string;
  creatorName: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSuccess: () => void;
}) {
  const [isPending, setIsPending] = useState(false);

  const handleDelete = useCallback(async () => {
    setIsPending(true);
    try {
      await CreatorAction.deleteCreator(creatorId);
      setIsOpen(false);
      toast.success('크리에이터가 삭제되었습니다');
      onSuccess();
    } catch {
      toast.error('삭제에 실패했습니다');
    } finally {
      setIsPending(false);
    }
  }, [creatorId, setIsOpen, onSuccess]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent showCloseButton={false} className='gap-0 rounded-sm'>
        <DialogTitle className='sr-only'>크리에이터 삭제</DialogTitle>
        <DialogDescription className='sr-only'>
          선택한 크리에이터를 삭제합니다.
        </DialogDescription>

        <div className='text-xl font-bold mt-2 mb-1'>크리에이터 삭제</div>
        <div className='text-sm text-gray-500 mb-8'>
          <strong>{creatorName}</strong>을(를) 삭제할까요?
        </div>

        <div className='flex justify-between items-center'>
          <button
            className={`flex justify-center items-center px-6 h-10 rounded-sm font-bold text-white ${
              isPending ? 'bg-red-400' : 'bg-red-600 hover:bg-red-400'
            }`}
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? (
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
