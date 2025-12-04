'use client';

import AddPostDialog from '@/components/series/addPostDialog';
import * as PostClientService from '@/features/post/domain/service/postClientService';
import usePostStat from '@/features/postStat/hooks/usePostStat';
import { SeriesProps } from '@/features/series/ui/seriesProps';
import { ApiError } from '@/lib/api';
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
import { GripVertical, Plus } from 'lucide-react';
import Link from 'next/link';
import { ReactNode, useCallback, useState } from 'react';
import toast from 'react-hot-toast';

export default function SeriesPostList({
  userId,
  series,
}: {
  userId: string | null;
  series: SeriesProps;
}) {
  const [posts, setPosts] = useState(series.posts);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

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

      const prevPosts = posts;

      const oldIndex = posts.findIndex(post => post.id === active.id);
      const newIndex = posts.findIndex(post => post.id === over.id);
      const newPosts = arrayMove(posts, oldIndex, newIndex);
      setPosts(newPosts);

      try {
        const newPostIds = newPosts.map(post => post.id);
        await PostClientService.updatePostsOrder(newPostIds);
      } catch (error) {
        setPosts(prevPosts);
        const message =
          error instanceof ApiError
            ? error.message
            : '게시글 순서 변경에 실패했습니다';
        toast.error(message);
      }
    },
    [posts]
  );

  const handleAddPost = async (postId: string) => {
    // TODO: API 호출
    // 성공하면 setPosts로 목록 갱신
  };

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
        <button
          onClick={() => setIsAddDialogOpen(true)}
          className='mt-6 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-700 transition-colors font-medium mx-auto'
        >
          <Plus className='w-5 h-5' />
          <div>글 추가</div>
        </button>

        <AddPostDialog
          userId={userId ?? ''}
          seriesId={series.id}
          existingPostIds={posts.map(p => p.id)}
          isOpen={isAddDialogOpen}
          setIsOpen={setIsAddDialogOpen}
          onAdd={handleAddPost}
        />
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
