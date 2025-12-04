'use client';

import usePostStat from '@/features/postStat/hooks/usePostStat';
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
import { GripVertical } from 'lucide-react';
import Link from 'next/link';
import { ReactNode, useCallback, useState } from 'react';

export default function SeriesPostList({
  userId,
  series,
}: {
  userId: string | null;
  series: SeriesProps;
}) {
  const [posts, setPosts] = useState(series.posts);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setPosts(items => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });

      // TODO: API 호출로 서버에 순서 저장
    }
  }, []);

  if (posts.length === 0) {
    return (
      <div className='text-center py-20 text-gray-500'>
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
            <div key={post.id}>
              <SortableContainer
                id={post.id}
                disabled={userId !== series.userId}
              >
                <SeriesPost post={post} index={index} />
              </SortableContainer>
            </div>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

function SortableContainer({
  id,
  disabled,
  children,
}: {
  id: string;
  disabled: boolean;
  children: ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={
        'flex gap-4 items-center relative p-4 -m-4 rounded-xl hover:bg-gray-100/50 transition-colors'
      }
    >
      <div className='flex-1 min-w-0'>{children}</div>
      {!disabled && (
        <div
          {...attributes}
          {...listeners}
          className='cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-400 shrink-0 mt-0.5'
        >
          <GripVertical className='w-5 h-5' />
        </div>
      )}
    </div>
  );
}

function SeriesPost({
  post,
  index,
}: {
  post: SeriesProps['posts'][number];
  index: number;
}) {
  const {
    stat: { viewCount },
  } = usePostStat({ postId: post.id });

  return (
    <Link href={`/read/${post.id}`} className='flex items-start gap-4 group'>
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
  );
}

function Divider() {
  return <div className='w-[3px] h-[3px] rounded-full bg-gray-500' />;
}
