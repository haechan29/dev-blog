'use client';

import clsx from 'clsx';
import { ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Fragment, useCallback } from 'react';

export default function WritePostToolbar({
  toolbarTexts,
  actionButtonText,
  action,
  onAction,
}: {
  toolbarTexts: {
    isCurrentStep: boolean;
    content: string;
  }[];
  actionButtonText: string;
  action: string;
  onAction: (action: string) => void;
}) {
  const router = useRouter();
  const onBackButtonClick = useCallback(() => router.back(), [router]);
  const onActionButtonClick = useCallback(
    () => onAction(action),
    [action, onAction]
  );

  return (
    <div
      className={clsx(
        'sticky top-0 z-40 w-full flex items-center gap-4',
        'p-2 md:p-4 bg-white/80 backdrop-blur-md'
      )}
    >
      <BackButton onClick={onBackButtonClick} />
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

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'py-2 px-4 rounded-lg font-semibold',
        'text-gray-700 bg-gray-200 hover:bg-gray-100'
      )}
    >
      나가기
    </button>
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
    <div className='w-full flex items-center gap-2'>
      {toolbarTexts.map(({ isCurrentStep, content }, index) => {
        const isLast = toolbarTexts.length - 1 === index;

        return (
          <Fragment key={`${content}-${index}`}>
            <div
              className={clsx(
                'truncate',
                isCurrentStep ? 'text-gray-900' : 'text-gray-400'
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
        'py-2 px-6 rounded-lg font-semibold',
        'bg-blue-600 text-white hover:bg-blue-500'
      )}
    >
      {actionButtonText}
    </button>
  );
}
