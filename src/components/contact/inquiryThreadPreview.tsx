'use client';

import InquiryThreadDropdown from '@/components/contact/inquiryThreadDropdown';
import { ApiError } from '@/errors/errors';
import * as InquiryClientRepository from '@/features/inquiry/data/repository/inquiryClientRepository';
import { InquiryThreadStatus } from '@/features/inquiry/domain/types/inquiryThreadStatus';
import { InquiryThreadProps } from '@/features/inquiry/ui/model/inquiryThreadProps';
import { formatDate } from '@/features/post/domain/lib/date';
import { inquiryKeys } from '@/queries/keys';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { Archive, CircleCheck, Clock, MoreVertical } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';

function statusIcon(status: InquiryThreadStatus) {
  switch (status) {
    case 'AWAITING_REPLY':
      return <Clock className='w-5 h-5 text-amber-500' />;
    case 'ANSWERED':
      return <CircleCheck className='w-5 h-5 text-emerald-500' />;
    case 'CLOSED':
      return <Archive className='w-5 h-5 text-gray-400' />;
  }
}

export default function InquiryThreadPreview({
  thread,
}: {
  thread: InquiryThreadProps;
}) {
  const queryClient = useQueryClient();
  const [isHovered, setIsHovered] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const deleteThreadMutation = useMutation({
    mutationFn: (threadId: string) =>
      InquiryClientRepository.deleteInquiryThread(threadId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: inquiryKeys.threads() });
      toast.success('문의가 삭제되었습니다');
      setDeleteDialogOpen(false);
    },
    onError: error => {
      const message =
        error instanceof ApiError ? error.message : '문의 삭제에 실패했습니다';
      toast.error(message);
    },
  });

  const handleDeleteConfirmed = useCallback(
    (threadId: string) => {
      if (!threadId) return;
      deleteThreadMutation.mutate(threadId);
    },
    [deleteThreadMutation]
  );

  return (
    <div className='relative flex flex-col mb-8'>
      <div
        className={clsx(
          'absolute -inset-x-6 -inset-y-4 -z-50 rounded-xl bg-gray-100/50',
          'origin-center transition duration-300 ease-in-out',
          isHovered ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
        )}
      />

      <div className='absolute top-0 right-0 z-10 flex items-center'>
        <InquiryThreadDropdown
          threadId={thread.id}
          deleteDialogOpen={deleteDialogOpen}
          isDeleting={deleteThreadMutation.isPending}
          setDeleteDialogOpen={setDeleteDialogOpen}
          onDeleteConfirmed={handleDeleteConfirmed}
        >
          <MoreVertical className='w-9 h-9 text-gray-400 hover:text-gray-500 hover:bg-gray-200 rounded-full p-2 -m-2 cursor-pointer' />
        </InquiryThreadDropdown>
      </div>

      <div
        onMouseLeave={() => setIsHovered(false)}
        className='w-full flex flex-col'
      >
        <Link
          href={`/contact/${thread.id}`}
          className='w-full flex gap-4 text-left text-gray-900'
          onMouseEnter={() => setIsHovered(true)}
        >
          <div className='relative shrink-0 pt-1'>
            {statusIcon(thread.status)}
            {thread.userUnreadCount > 0 && (
              <span className='absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-red-500 ring-2 ring-white' />
            )}
          </div>

          <div className='flex min-w-0 flex-1 flex-col gap-2 pr-8'>
            <div className='flex justify-between gap-3'>
              <p
                className={clsx(
                  'line-clamp-1 text-lg sm:text-xl font-semibold text-gray-900'
                )}
              >
                {thread.firstLineText}
              </p>
              <span className='shrink-0 text-xs text-gray-500'>
                {formatDate(thread.updatedAt)}
              </span>
            </div>

            <p className='text-sm text-gray-500 line-clamp-2'>
              {thread.secondLineText}
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
