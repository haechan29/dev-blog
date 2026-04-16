'use client';

import InquiryMessageDropdown from '@/components/contact/inquiryMessageDropdown';
import { ApiError } from '@/errors/errors';
import * as InquiryClientRepository from '@/features/inquiry/data/repository/inquiryClientRepository';
import useMediaQuery, { TOUCH_QUERY } from '@/hooks/useMediaQuery';
import { inquiryKeys } from '@/queries/keys';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { MoreVertical } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';

const LONG_PRESS_MS = 500;

export default function InquiryMessage({
  threadId,
  messageId,
  isDeleted,
  content,
  imageUrls,
  showTime,
  timeLabel,
  isUser,
  onImagePreview,
}: {
  threadId?: string;
  messageId: string;
  isDeleted: boolean;
  content: string;
  imageUrls: string[];
  showTime: boolean;
  timeLabel: string;
  isUser: boolean;
  onImagePreview: (src: string, alt: string) => void;
}) {
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const queryClient = useQueryClient();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const isTouchDevice = useMediaQuery(TOUCH_QUERY);

  const deleteMessageMutation = useMutation({
    mutationFn: (threadId: string) =>
      InquiryClientRepository.deleteInquiryMessage(threadId, messageId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: inquiryKeys.threads() });
      toast.success('메시지가 삭제되었습니다');
      setDeleteDialogOpen(false);
    },
    onError: error => {
      const message =
        error instanceof ApiError
          ? error.message
          : '메시지 삭제에 실패했습니다';
      toast.error(message);
    },
  });

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success('복사되었습니다');
    } catch {
      toast.error('복사에 실패했습니다');
    }
  }, [content]);

  const handleDeleteConfirmed = useCallback(
    (threadId: string) => {
      if (!threadId) return;
      deleteMessageMutation.mutate(threadId);
    },
    [deleteMessageMutation]
  );

  const hasText = content.trim().length > 0;
  const hasImages = imageUrls.length > 0;
  const showMenu = isUser && hasText && isTouchDevice === false;
  const canLongPress = isUser && hasText && isTouchDevice === true;

  const isDesktopDropdownOpen = useMemo(
    () => isTouchDevice === false && isDropdownOpen,
    [isDropdownOpen, isTouchDevice]
  );

  const isMobileDropdownOpen = useMemo(
    () => isTouchDevice === true && isDropdownOpen,
    [isDropdownOpen, isTouchDevice]
  );

  const clearLongPressTimer = useCallback(() => {
    if (!canLongPress) return;
    if (longPressTimerRef.current === null) return;

    clearTimeout(longPressTimerRef.current);
    longPressTimerRef.current = null;
  }, [canLongPress]);

  const onTouchStartLongPress = useCallback(() => {
    if (!canLongPress) return;
    clearLongPressTimer();
    longPressTimerRef.current = setTimeout(() => {
      longPressTimerRef.current = null;
      setIsDropdownOpen(true);
    }, LONG_PRESS_MS);
  }, [canLongPress, clearLongPressTimer]);

  const onTouchEndLongPress = useCallback(() => {
    if (!canLongPress) return;
    clearLongPressTimer();
  }, [canLongPress, clearLongPressTimer]);

  useEffect(() => () => clearLongPressTimer(), [clearLongPressTimer]);

  const handleDropdownOpenChange = useCallback(
    (open: boolean) => {
      if (isTouchDevice === true && open) return;
      setIsDropdownOpen(open);
    },
    [isTouchDevice]
  );

  const bubble = (
    <InquiryMessageDropdown
      threadId={threadId}
      skipRender={isTouchDevice !== true}
      open={isMobileDropdownOpen}
      deleteDialogOpen={deleteDialogOpen}
      isDeleted={isDeleted}
      isDeleting={deleteMessageMutation.isPending}
      setOpen={handleDropdownOpenChange}
      setDeleteDialogOpen={setDeleteDialogOpen}
      onDeleteConfirmed={handleDeleteConfirmed}
      onCopy={handleCopy}
    >
      <div
        onTouchStart={onTouchStartLongPress}
        onTouchEnd={onTouchEndLongPress}
        onTouchCancel={onTouchEndLongPress}
        onContextMenu={e => {
          if (canLongPress) e.preventDefault();
        }}
        className={clsx(
          'min-w-0 rounded-2xl px-3.5 py-2.5 text-[15px] leading-snug wrap-break-word whitespace-pre-wrap',
          isUser ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-900'
        )}
      >
        {content}
      </div>
    </InquiryMessageDropdown>
  );

  const timeEl = showTime && (
    <span
      className={clsx(
        'absolute right-0 bottom-0 text-xs text-gray-400 pb-px pointer-events-none',
        showMenu &&
          'transition-opacity opacity-100 group-hover/msg:opacity-0 group-focus-within/slot:opacity-0'
      )}
    >
      {timeLabel}
    </span>
  );

  const menu = showMenu && (
    <InquiryMessageDropdown
      threadId={threadId}
      skipRender={isTouchDevice !== false}
      open={isDesktopDropdownOpen}
      deleteDialogOpen={deleteDialogOpen}
      isDeleted={isDeleted}
      isDeleting={deleteMessageMutation.isPending}
      setOpen={handleDropdownOpenChange}
      setDeleteDialogOpen={setDeleteDialogOpen}
      onDeleteConfirmed={handleDeleteConfirmed}
      onCopy={handleCopy}
    >
      <button
        type='button'
        aria-label='메시지 메뉴'
        aria-expanded={isDesktopDropdownOpen}
        className={clsx(
          'absolute right-0 bottom-0 z-10 flex h-8 w-8 items-center justify-center rounded-md text-gray-400 hover:bg-black/5 hover:text-gray-600',
          'transition-opacity opacity-0 group-hover/msg:opacity-100',
          'group-focus-within/slot:opacity-100 focus-visible:opacity-100 focus-visible:outline-none'
        )}
        onClick={e => {
          e.stopPropagation();
          setIsDropdownOpen(open => open);
        }}
      >
        <MoreVertical size={18} aria-hidden className='shrink-0' />
      </button>
    </InquiryMessageDropdown>
  );

  const imageGrid = hasImages && (
    <div
      className={clsx(
        'flex flex-wrap gap-1.5',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      {imageUrls.map((url, index) => (
        <div
          key={`${url}-${index}`}
          className='h-32 w-32 shrink-0 rounded-lg overflow-hidden border border-gray-200 bg-gray-50'
        >
          <button
            type='button'
            aria-label={`메시지 이미지 ${index + 1} 크게 보기`}
            className='block h-full w-full cursor-zoom-in border-0 bg-transparent p-0'
            onClick={() => onImagePreview(url, `메시지 이미지 ${index + 1}`)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={`메시지 이미지 ${index + 1}`}
              className='pointer-events-none h-full w-full object-cover'
              draggable={false}
            />
          </button>
        </div>
      ))}
    </div>
  );

  const slot = (
    <div className='min-w-8 min-h-8 group/slot relative shrink-0'>
      {timeEl}
      {menu}
    </div>
  );

  return (
    <div className='flex flex-col gap-1'>
      {!isUser && <div className='text-sm ml-1'>운영자</div>}
      <div
        className={clsx(
          'flex w-full',
          isUser ? 'justify-end' : 'justify-start'
        )}
      >
        <div
          className={clsx(
            'flex min-w-0 max-w-[min(100%,85%)] flex-col gap-1.5',
            isUser ? 'items-end' : 'items-start'
          )}
        >
          {imageGrid}
          {hasText && (
            <div
              className={clsx(
                'flex w-full items-end gap-2 group/msg',
                isUser ? 'justify-end' : 'justify-start'
              )}
            >
              {isUser ? (
                <>
                  {slot}
                  {bubble}
                </>
              ) : (
                <>
                  {bubble}
                  {slot}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
