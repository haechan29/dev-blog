'use client';

import TiptapEditor, {
  TiptapEditorRef,
} from '@/components/tiptap/editor/tiptapEditor';
import ProfileIcon from '@/components/user/profileIcon';
import { DeleteDraftDialog } from '@/components/write/deleteDraftDialog';
import DraftSidebar from '@/components/write/draftSidebar';
import PublishDialog from '@/components/write/publishDialog';
import TableOfContents, { TocAnchor } from '@/components/write/tableOfContents';
import TagInput from '@/components/write/tagInput';
import WriteToolbar from '@/components/write/writeToolbar';
import { ApiError } from '@/errors/errors';
import { DraftDto } from '@/features/draft/data/dto/draftDto';
import useDrafts from '@/features/draft/hooks/useDrafts';
import useSaveShortcut from '@/features/draft/hooks/useSaveShortcut';
import * as PostClientService from '@/features/post/domain/service/postClientService';
import { PostVisibility } from '@/features/post/domain/types/postVisibility';
import useBgmController from '@/features/post/hooks/useBgmController';
import { createProps, PostProps } from '@/features/post/ui/postProps';
import useUser from '@/features/user/domain/hooks/useUser';
import useRouterWithProgress from '@/hooks/useRouterWithProgress';
import { draftKeys } from '@/queries/keys';
import { useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { Heart } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

function getInitialState(
  post: PostProps | undefined,
  initialDrafts: DraftDto[] | undefined
) {
  const matched =
    post && initialDrafts
      ? initialDrafts.find(d => d.postId === post.id)
      : undefined;
  return {
    title: matched?.title ?? post?.title ?? '',
    tags: matched?.tags ?? post?.tags ?? [],
    contentJson: matched?.contentJson ?? post?.contentJson ?? undefined,
    currentDraftId: matched?.id ?? null,
  };
}

export default function WritePageClient({
  post,
  skipPasswordInput,
  initialDrafts,
}: {
  post?: PostProps;
  skipPasswordInput: boolean;
  initialDrafts?: DraftDto[];
}) {
  const isEditMode = !!post;
  const initial = getInitialState(post, initialDrafts);

  const [title, setTitle] = useState(initial.title);
  const [tags, setTags] = useState<string[]>(initial.tags);
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(
    initial.currentDraftId
  );
  const [anchors, setAnchors] = useState<TocAnchor[]>([]);
  const [isDraftSidebarVisible, setIsDraftSidebarVisible] = useState(false);

  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);
  const [isPublishPending, setIsPublishPending] = useState(false);
  const [saveJustSucceeded, setSaveJustSucceeded] = useState(false);

  const [isDeleteDraftDialogOpen, setIsDeleteDraftDialogOpen] = useState(false);
  const [deleteTargetDraftId, setDeleteTargetDraftId] = useState<string | null>(
    null
  );

  const editorRef = useRef<TiptapEditorRef>(null);
  const saveSucceededTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const { user } = useUser();
  const { drafts, saveDraftMutation, deleteDraftMutation } =
    useDrafts(initialDrafts);
  const router = useRouterWithProgress();
  const queryClient = useQueryClient();

  useBgmController();

  useEffect(() => {
    return () => {
      if (saveSucceededTimeoutRef.current) {
        clearTimeout(saveSucceededTimeoutRef.current);
      }
    };
  }, []);

  const applyDraftToEditor = (draft: DraftDto) => {
    setTitle(draft.title ?? '');
    setTags(draft.tags ?? []);
    editorRef.current?.setContent(draft.contentJson);
  };

  const handleDraftSelect = (draftId: string) => {
    const draft = drafts?.find(d => d.id === draftId);
    if (draft) {
      applyDraftToEditor(draft);
      setCurrentDraftId(draftId);
    }
  };

  const handleDraftDeleteClick = (draftId: string) => {
    setDeleteTargetDraftId(draftId);
    setIsDeleteDraftDialogOpen(true);
  };

  const handleDraftDelete = () => {
    if (!deleteTargetDraftId) return;

    deleteDraftMutation.mutate(deleteTargetDraftId, {
      onSuccess: () => {
        toast.success('임시저장 글이 삭제되었습니다');

        if (currentDraftId === deleteTargetDraftId) {
          setCurrentDraftId(null);
        }

        setDeleteTargetDraftId(null);
        setIsDeleteDraftDialogOpen(false);
      },
      onError: error => {
        const message =
          error instanceof ApiError
            ? error.message
            : '임시저장 글 삭제에 실패했습니다';
        toast.error(message);
      },
    });
  };

  const handleNext = () => {
    if (!title.trim()) {
      toast.error('제목을 입력해주세요');
      return;
    }
    if (editorRef.current?.isEmpty()) {
      toast.error('내용을 입력해주세요');
      return;
    }
    setIsPublishDialogOpen(true);
  };

  const handleSave = () => {
    if (isPublishPending || saveDraftMutation.isPending) return;

    saveDraftMutation.mutate(
      {
        draftId: currentDraftId,
        postId: post?.id ?? null,
        title,
        contentJson: editorRef.current?.getJSON(),
        tags,
      },
      {
        onSuccess: savedDraft => {
          setCurrentDraftId(savedDraft.id);

          if (saveSucceededTimeoutRef.current) {
            clearTimeout(saveSucceededTimeoutRef.current);
          }
          setSaveJustSucceeded(true);
          saveSucceededTimeoutRef.current = setTimeout(() => {
            setSaveJustSucceeded(false);
          }, 1000);
        },
        onError: error => {
          const message =
            error instanceof ApiError
              ? error.message
              : '임시저장에 실패했습니다';
          toast.error(message);
        },
      }
    );
  };

  useSaveShortcut({
    enabled: !isPublishDialogOpen,
    onSave: handleSave,
  });

  const handlePublish = async (data: {
    visibility: PostVisibility;
    password: string;
  }) => {
    const contentJson = editorRef.current?.getJSON();
    if (!contentJson) return;

    setIsPublishPending(true);
    try {
      if (isEditMode) {
        await PostClientService.updatePost({
          postId: post.id,
          title,
          contentJson,
          tags,
          password: data.password,
          visibility: data.visibility,
        });
        queryClient.invalidateQueries({
          queryKey: draftKeys.list(),
        });
        setIsPublishDialogOpen(false);
        router.push(`/read/${post.id}`);
      } else {
        const newPost = await PostClientService.createPost({
          title,
          content: '',
          contentJson,
          tags,
          password: data.password,
          visibility: data.visibility,
        });
        const postProps = createProps(newPost);
        queryClient.invalidateQueries({
          queryKey: draftKeys.list(),
        });
        setIsPublishDialogOpen(false);
        router.push(`/read/${postProps.id}`);
      }
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : isEditMode
            ? '게시글 수정에 실패했습니다'
            : '게시글 생성에 실패했습니다';

      toast.error(message);
    } finally {
      setIsPublishPending(false);
    }
  };

  return (
    <>
      <WriteToolbar
        hasDrafts={(drafts?.length ?? 0) > 0}
        onOpenDraftSidebar={() => setIsDraftSidebarVisible(true)}
        onNext={handleNext}
        isPublishPending={isPublishPending}
        onSave={handleSave}
        isSavePending={saveDraftMutation.isPending}
        saveJustSucceeded={saveJustSucceeded}
      />

      <DraftSidebar
        currentDraftId={currentDraftId}
        drafts={drafts}
        isVisible={isDraftSidebarVisible}
        setIsVisible={setIsDraftSidebarVisible}
        onSelectDraft={handleDraftSelect}
        onDeleteDraft={handleDraftDeleteClick}
      />

      <div className='fixed top-0 right-0 w-(--toc-width) mr-(--toc-margin) h-full max-xl:hidden'>
        <TableOfContents anchors={anchors} showPlaceholder />
      </div>

      <div
        className={clsx(
          'mt-(--toolbar-height) mb-12 px-6 md:px-12 xl:px-18',
          'xl:ml-(--sidebar-width)',
          'xl:mr-[calc(var(--toc-width)+var(--toc-margin))]'
        )}
      >
        <div className='max-w-[65ch] mx-auto'>
          <div data-post-header className='flex flex-col gap-6 mb-10'>
            <textarea
              value={title}
              onChange={e => {
                setTitle(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
              }}
              placeholder='제목'
              rows={1}
              maxLength={100}
              className='w-full text-3xl font-bold outline-none resize-none scrollbar-hide placeholder:text-gray-400'
            />

            <TagInput tags={tags} onChange={setTags} />

            <div className='flex gap-2 items-center text-xs'>
              <ProfileIcon
                nickname={user?.nickname ?? ''}
                size='sm'
                profileImageUrl={user?.profileImageUrl ?? undefined}
              />
              <span className='text-gray-900'>{user?.nickname}</span>
              <div className='w-[3px] h-[3px] rounded-full bg-gray-400' />
              <span className='text-gray-500'>방금 전</span>
            </div>
          </div>

          <div className='w-full h-px bg-gray-200 mb-10' />

          <TiptapEditor
            ref={editorRef}
            initialContent={initial.contentJson}
            onAnchorsChange={setAnchors}
            className='mb-20'
          />

          <LikeButtonPreview />
          <AuthorProfilePreview />
          <CommentsPreview />
        </div>
      </div>

      <PublishDialog
        isOpen={isPublishDialogOpen}
        onClose={() => setIsPublishDialogOpen(false)}
        onPublish={handlePublish}
        skipPasswordInput={skipPasswordInput}
        isPending={isPublishPending}
      />

      {deleteTargetDraftId && (
        <DeleteDraftDialog
          draftId={deleteTargetDraftId}
          isOpen={isDeleteDraftDialogOpen}
          setIsOpen={setIsDeleteDraftDialogOpen}
          isPending={deleteDraftMutation.isPending}
          onDelete={handleDraftDelete}
        />
      )}
    </>
  );
}

function LikeButtonPreview() {
  return (
    <div className='flex justify-center mb-20 pointer-events-none'>
      <div className='flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200'>
        <Heart size={20} className='text-gray-400' />
        <div className='text-sm text-gray-600'>0</div>
      </div>
    </div>
  );
}

function AuthorProfilePreview() {
  const { user } = useUser();

  return (
    <div className='flex items-center gap-3 mb-12 pointer-events-none'>
      <ProfileIcon
        nickname={user?.nickname ?? ''}
        size='md'
        profileImageUrl={user?.profileImageUrl ?? undefined}
      />
      <div className='flex-1 min-w-0'>
        <div className='font-medium text-gray-900 truncate'>
          {user?.nickname}
        </div>
        {user?.bio && (
          <div className='text-xs text-gray-500 truncate'>{user.bio}</div>
        )}
      </div>
    </div>
  );
}

function CommentsPreview() {
  return (
    <div className='w-full p-4 mb-12 bg-gray-50 rounded-lg text-left pointer-events-none'>
      <div className='mb-2 text-sm font-medium text-gray-700'>댓글 0개</div>
      <div className='text-sm text-gray-500'>첫 번째 댓글을 작성해보세요</div>
    </div>
  );
}
