'use client';

import { WritePostToolbarProps } from '@/features/write/ui/writePostToolbarProps';
import clsx from 'clsx';
import { ChevronRight } from 'lucide-react';
import { Fragment, useCallback } from 'react';

export default function WritePostToolbar({
  writePostToolbar: { toolbarTexts, actionButtonText },
  setShouldValidate,
  onAction,
}: {
  writePostToolbar: WritePostToolbarProps;
  setShouldValidate: (shouldValidate: boolean) => void;
  onAction: () => void;
}) {
  const onActionButtonClick = useCallback(() => {
    setShouldValidate(true);
    onAction();
  }, [onAction, setShouldValidate]);

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
