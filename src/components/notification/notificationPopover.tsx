'use client';

import BellIcon from '@/components/bellIcon';
import Notification from '@/components/notification/notification';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import * as NotificationClientRepository from '@/features/notification/data/repository/notificationClientRepository';
import * as NotificationClientService from '@/features/notification/domain/service/notificationClientService';
import type { NotificationCursor } from '@/features/notification/domain/types/notificationCursor';
import { notificationKeys } from '@/queries/keys';
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import SimpleBar from 'simplebar-react';

const UNREAD_COUNT_REFETCH_MS = 5 * 60 * 1000;

export default function NotificationPopover() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const { ref, inView } = useInView();

  const { data: unreadData } = useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: () => NotificationClientRepository.getUnreadNotificationCount(),
    refetchInterval: UNREAD_COUNT_REFETCH_MS,
  });

  const unreadCount = unreadData?.unreadCount ?? 0;
  const showUnreadDot = unreadCount > 0;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching,
  } = useInfiniteQuery({
    queryKey: notificationKeys.list(),
    queryFn: async ({ pageParam }) => {
      const result = await NotificationClientService.getNotifications({
        cursor: pageParam,
      });
      if (pageParam === null) {
        queryClient.invalidateQueries({
          queryKey: notificationKeys.unreadCount(),
        });
      }
      return result;
    },
    initialPageParam: null as NotificationCursor | null,
    getNextPageParam: lastPage => lastPage.nextCursor,
    enabled: open,
    staleTime: 0,
  });

  const notifications = useMemo(
    () => data?.pages.flatMap(page => page.notifications) ?? [],
    [data]
  );

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const showInitialSpinner = open && isLoading;
  const isEmpty = !isLoading && !isFetching && notifications.length === 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type='button'
          className='relative shrink-0 p-2 -m-2 cursor-pointer rounded-full hover:bg-gray-100'
          aria-label={`알림, 읽지 않은 알림 ${unreadCount}개`}
        >
          <BellIcon className='w-6 h-6' strokeWidth={1.5} />
          {showUnreadDot ? (
            <span
              className='pointer-events-none absolute top-2.5 right-2.5 h-1.5 w-1.5 rounded-full bg-red-500 ring-2 ring-white'
              aria-hidden
            />
          ) : null}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align='end'
        sideOffset={8}
        onOpenAutoFocus={e => e.preventDefault()}
        className='w-[min(100vw-2rem,22rem)] p-0 overflow-hidden'
      >
        <div className='border-b border-gray-100 px-3 py-2'>
          <p className='text-sm font-semibold text-gray-900'>알림</p>
        </div>
        {showInitialSpinner ? (
          <div className='py-6 flex justify-center'>
            <Loader2
              strokeWidth={3}
              className='w-5 h-5 animate-spin text-gray-400'
            />
          </div>
        ) : isEmpty ? (
          <div className='py-8 px-3 text-center text-sm text-gray-400'>
            알림이 없습니다
          </div>
        ) : (
          <SimpleBar className='max-h-[min(70vh,320px)] simplebar-hover'>
            <div>
              {notifications.map(notification => (
                <Notification
                  key={notification.id}
                  notification={notification}
                />
              ))}
              <div ref={ref} className='h-1' aria-hidden />
              {isFetchingNextPage ? (
                <div className='flex justify-center py-3'>
                  <Loader2
                    strokeWidth={3}
                    className='w-5 h-5 animate-spin text-gray-400'
                  />
                </div>
              ) : null}
            </div>
          </SimpleBar>
        )}
      </PopoverContent>
    </Popover>
  );
}
