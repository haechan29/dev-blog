'use client';

import RemovePostDialog from '@/components/series/removePostDialog';
import usePostStat from '@/features/postStat/hooks/usePostStat';
import useSeriesPosts from '@/features/series/domain/hooks/useSeriesPosts';
import { SeriesProps } from '@/features/series/ui/seriesProps';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';
import { GripVertical, X } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useState } from 'react';

export default function SeriesPostList({
  userId,
  series,
}: {
  userId: string | null;
  series: SeriesProps;
}) {
  const { posts, reorderPostsMutation } = useSeriesPosts(series);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = posts.findIndex(post => post.id === active.id);
      const newIndex = posts.findIndex(post => post.id === over.id);
      const newPosts = arrayMove(posts, oldIndex, newIndex).map(
        (post, index) => ({ ...post, seriesOrder: index })
      );
      reorderPostsMutation.mutate(newPosts);
    },
    [posts, reorderPostsMutation]
  );

  if (posts.length === 0) {
    return (
      <div className='text-center pt-20 text-gray-500'>
        시리즈에 포함된 글이 없습니다
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={posts} strategy={verticalListSortingStrategy}>
        <div className='flex flex-col gap-8'>
          {posts.map((post, index) => (
            <div
              key={post.id}
              className='relative p-4 -m-4 rounded-xl group hover:bg-gray-100/50 transition-colors'
            >
              <SeriesPost
                post={post}
                index={index}
                isOwner={userId === series.userId}
                onRemoveClick={post => {
                  setSelectedPostId(post.id);
                }}
              />
            </div>
          ))}
        </div>

        {userId === series.userId && (
          <RemovePostDialog
            seriesId={series.id}
            postId={selectedPostId}
            resetPostId={() => setSelectedPostId(null)}
          />
        )}
      </SortableContext>
    </DndContext>
  );
}

function SeriesPost({
  post,
  index,
  isOwner,
  onRemoveClick,
}: {
  post: SeriesProps['posts'][number];
  index: number;
  isOwner: boolean;
  onRemoveClick: (post: { id: string; title: string }) => void;
}) {
  const {
    stat: { viewCount },
  } = usePostStat({ postId: post.id });

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: post.id, disabled: !isOwner });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className='flex gap-4 items-center'
      suppressHydrationWarning
    >
      <div className='flex-1 min-w-0'>
        <Link href={`/read/${post.id}`} className='flex items-start gap-4'>
          <div className='text-xl font-semibold text-gray-300 group-hover:text-gray-400 min-w-8 mt-0.5'>
            {index + 1}
          </div>
          <div className='flex-1 flex flex-col gap-2'>
            <div className='text-xl font-semibold text-gray-900 line-clamp-2'>
              {post.title}
            </div>
            <div className='flex items-center gap-2 text-xs text-gray-500'>
              <div>{post.createdAt}</div>
              <Divider />
              <div>조회 {viewCount}</div>
            </div>
          </div>
        </Link>
      </div>

      {isOwner && (
        <button
          onClick={() => {
            onRemoveClick(post);
          }}
          className='text-gray-300 group-hover:text-gray-400 hover:text-red-500 p-2 -m-2'
        >
          <X className='w-5 h-5' />
        </button>
      )}

      {isOwner && (
        <div
          {...attributes}
          {...listeners}
          className={clsx(
            'cursor-grab active:cursor-grabbing text-gray-300 group-hover:text-gray-400 shrink-0',
            'p-2 -m-2 rounded-full hover:bg-gray-200'
          )}
        >
          <GripVertical className='w-5 h-5' />
        </div>
      )}
    </div>
  );
}

function Divider() {
  return <div className='w-[3px] h-[3px] rounded-full bg-gray-500' />;
}
