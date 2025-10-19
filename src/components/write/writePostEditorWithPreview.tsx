'use client';

import WritePostEditor from '@/components/write/writePostEditor';
import WritePostPreview from '@/components/write/writePostPreview';
import { WritePostFormProps } from '@/features/write/ui/writePostFormProps';
import { WritePostValidityProps } from '@/features/write/ui/writePostValidityProps';
import clsx from 'clsx';
import { useState } from 'react';

type Mode = 'edit' | 'preview';

export default function WritePostEditorWithPreview({
  writePostForm: { content },
  writePostValidity: { isContentValid },
  setContent,
  setShouldValidate,
}: {
  writePostForm: WritePostFormProps;
  writePostValidity: WritePostValidityProps;
  setContent: (content: string) => void;
  setShouldValidate: (shouldValidate: boolean) => void;
}) {
  const [mode, setMode] = useState<Mode>('edit');

  return (
    <div className='w-full'>
      <div className='lg:hidden mb-4'>
        <ModeToggle mode={mode} setMode={setMode} />
      </div>

      <div className='w-full flex gap-4'>
        <div
          className={clsx(
            'flex-1',
            mode === 'edit' ? 'block' : 'hidden lg:block'
          )}
        >
          <WritePostEditor
            content={content}
            isContentValid={isContentValid}
            setContent={setContent}
            setShouldValidate={setShouldValidate}
          />
        </div>

        <div
          className={clsx(
            'flex-1',
            mode === 'preview' ? 'block' : 'hidden lg:block'
          )}
        >
          <WritePostPreview content={content} />
        </div>
      </div>
    </div>
  );
}

function ModeToggle({
  mode,
  setMode,
}: {
  mode: Mode;
  setMode: (mode: Mode) => void;
}) {
  return (
    <div className='flex gap-2 mb-4'>
      <button
        onClick={() => setMode('edit')}
        className={clsx(
          'flex-1 py-2 px-4 rounded-lg font-semibold',
          mode === 'edit'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        )}
      >
        Edit
      </button>
      <button
        onClick={() => setMode('preview')}
        className={clsx(
          'flex-1 py-2 px-4 rounded-lg font-semibold',
          mode === 'preview'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        )}
      >
        Preview
      </button>
    </div>
  );
}
