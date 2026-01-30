'use client';

import { ApiError } from '@/errors/errors';
import { PostProps } from '@/features/post/ui/postProps';
import { writePostSteps } from '@/features/write/constants/writePostStep';
import { validate } from '@/features/write/domain/model/writePostForm';
import useNavigationWithParams from '@/hooks/useNavigationWithParams';
import useRouterWithProgress from '@/hooks/useRouterWithProgress';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { setInvalidField } from '@/lib/redux/write/writePostFormSlice';
import { postKeys } from '@/queries/keys';
import { useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { ChevronRight, Loader2 } from 'lucide-react';
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';

export default function WritePostToolbar({
  skipPasswordInput,
  publishPost,
  removeDraft,
}: {
  skipPasswordInput: boolean;
  publishPost: () => Promise<PostProps>;
  removeDraft: () => void;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();
  const router = useRouterWithProgress();
  const { currentStepId } = useSelector((state: RootState) => state.writePost);
  const writePostForm = useSelector((state: RootState) => state.writePostForm);
  const [isPending, setIsPending] = useState(false);
  const { toolbarTexts, actionButtonText } = useMemo(() => {
    return {
      toolbarTexts: Object.values(writePostSteps).map(step => ({
        isCurrentStep: step.id === currentStepId,
        content: step.toolbarText,
      })),
      ...writePostSteps[currentStepId],
    };
  }, [currentStepId]);

  const navigate = useNavigationWithParams();

  const getInvalidField = useCallback(() => {
    const currentStep = writePostSteps[currentStepId];
    return (
      currentStep.fields.find(
        field => !validate(skipPasswordInput, writePostForm, field)
      ) ?? null
    );
  }, [currentStepId, skipPasswordInput, writePostForm]);

  const onAction = useCallback(async () => {
    const currentStep = writePostSteps[currentStepId];
    switch (currentStep.action) {
      case 'next': {
        navigate({ setParams: { step: 'upload' } });
        break;
      }
      case 'publish': {
        setIsPending(true);
        try {
          const post = await publishPost();
          queryClient.setQueryData(postKeys.detail(post.id), post);
          navigate({ pathname: `/read/${post.id}` });
          removeDraft();
        } catch (error) {
          const message =
            error instanceof ApiError
              ? error.message
              : '게시글 생성에 실패했습니다';
          toast.error(message);
        } finally {
          setIsPending(false);
        }
        break;
      }
    }
  }, [currentStepId, navigate, publishPost, queryClient, removeDraft]);

  const onActionButtonClick = useCallback(() => {
    const invalidField = getInvalidField();
    if (invalidField) {
      dispatch(setInvalidField(invalidField));
    } else {
      onAction();
    }
  }, [dispatch, getInvalidField, onAction]);

  useEffect(() => {
    for (const step of Object.values(writePostSteps)) {
      if (currentStepId === step.id) break;
      const isValid = validate(skipPasswordInput, writePostForm, ...step.fields);
      if (!isValid) {
        router.push(`/write?step=${step.id}`);
      }
    }
  }, [currentStepId, skipPasswordInput, router, writePostForm]);

  return (
    <div
      className={clsx(
        'sticky top-0 z-40 w-full flex items-center',
        'p-2 gap-4 bg-white/80 backdrop-blur-md'
      )}
    >
      <div className='flex-1 min-w-0'>
        <Texts toolbarTexts={toolbarTexts} />
      </div>
      <ActionButton
        actionButtonText={actionButtonText}
        onClick={onActionButtonClick}
        isPending={isPending}
      />
    </div>
  );
}

function Texts({
  toolbarTexts,
}: {
  toolbarTexts: {
    isCurrentStep: boolean;
    content: string;
  }[];
}) {
  return (
    <div className='w-full flex items-center ml-2 gap-2'>
      {toolbarTexts.map(({ isCurrentStep, content }, index) => {
        const isLast = toolbarTexts.length - 1 === index;

        return (
          <Fragment key={`${content}-${index}`}>
            <div
              className={clsx(
                'truncate transition-colors duration-300 ease-in-out',
                isCurrentStep ? 'text-gray-900 font-semibold' : 'text-gray-400'
              )}
            >{`${index + 1}. ${content}`}</div>
            {!isLast && <ChevronRight className='w-4 h-4 text-gray-400' />}
          </Fragment>
        );
      })}
    </div>
  );
}

function ActionButton({
  actionButtonText,
  onClick,
  isPending,
}: {
  actionButtonText: string;
  onClick: () => void;
  isPending: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={isPending}
      className={clsx(
        'h-9 text-sm font-semibold py-2 px-4 mr-2 rounded-full',
        'bg-blue-600 text-white',
        isPending ? 'opacity-50' : 'hover:bg-blue-500'
      )}
    >
      {isPending ? (
        <Loader2 size={16} className='animate-spin' />
      ) : (
        actionButtonText
      )}
    </button>
  );
}
