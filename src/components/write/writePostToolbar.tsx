'use client';

import { PostProps } from '@/features/post/ui/postProps';
import { writePostSteps } from '@/features/write/constants/writePostStep';
import { validate } from '@/features/write/domain/model/writePostForm';
import useWritePostToolbar from '@/features/write/hooks/useWritePostToolbar';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { setInvalidField } from '@/lib/redux/write/writePostFormSlice';
import clsx from 'clsx';
import { ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Fragment, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function WritePostToolbar({
  publishPost,
  removeDraft,
}: {
  publishPost: () => Promise<PostProps>;
  removeDraft: () => void;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { currentStepId } = useSelector((state: RootState) => state.writePost);
  const writePost = useSelector((state: RootState) => state.writePost);
  const writePostForm = useSelector((state: RootState) => state.writePostForm);

  const getInvalidField = useCallback(() => {
    const currentStep = writePostSteps[currentStepId];
    return (
      currentStep.fields.find(field => !validate(writePostForm, field)) ?? null
    );
  }, [currentStepId, writePostForm]);

  useEffect(() => {
    for (const step of Object.values(writePostSteps)) {
      if (writePost.currentStepId === step.id) break;
      const isValid = validate(writePostForm, ...step.fields);
      if (!isValid) {
        router.push(`/write?step=${step.id}`);
      }
    }
  }, [router, writePost.currentStepId, writePostForm]);

  const {
    writePostToolbar: { toolbarTexts, actionButtonText },
    onAction,
  } = useWritePostToolbar({
    publishPost,
    removeDraft,
  });

  const onActionButtonClick = useCallback(() => {
    const invalidField = getInvalidField();
    if (invalidField) {
      dispatch(setInvalidField(invalidField));
    } else {
      onAction();
    }
  }, [dispatch, getInvalidField, onAction]);

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
}: {
  actionButtonText: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'text-sm font-semibold py-2 px-4 mr-2 rounded-full',
        'bg-blue-600 hover:bg-blue-500 text-white'
      )}
    >
      {actionButtonText}
    </button>
  );
}
