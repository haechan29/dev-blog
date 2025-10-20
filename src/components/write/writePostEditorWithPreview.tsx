'use client';

import WritePostEditorContent from '@/components/write/writePostEditorContent';
import WritePostEditorToolbar from '@/components/write/writePostEditorToolbar';
import WritePostPreview from '@/components/write/writePostPreview';
import { WritePostFormProps } from '@/features/write/ui/writePostFormProps';
import { WritePostValidityProps } from '@/features/write/ui/writePostValidityProps';
import useDebounce from '@/hooks/useDebounce';
import { processMd } from '@/lib/md';
import clsx from 'clsx';
import { useCallback, useEffect, useState } from 'react';

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
  const [htmlSource, setHtmlSource] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const debounce = useDebounce();

  const parseMd = useCallback(async () => {
    setIsError(false);
    try {
      const result = await processMd(content);
      setHtmlSource(result);
    } catch (error) {
      setIsError(true);
    }
  }, [content]);

  useEffect(() => {
    debounce(() => {
      parseMd();
    }, 300);
  }, [debounce, parseMd]);

  return (
    <div className='w-full gap-4 mb-10'>
      <div className='lg:hidden'>
        <ModeToggle mode={mode} setMode={setMode} />
      </div>

      <div>
        <WritePostEditorToolbar content={content} setContent={setContent} />
        <div className='w-full flex prose min-h-screen'>
          <div
            className={clsx(
              'flex-1 min-w-0',
              mode === 'edit' ? 'flex' : 'hidden lg:flex'
            )}
          >
            <WritePostEditorContent
              content={content}
              isContentValid={isContentValid}
              isError={isError}
              setContent={setContent}
              setShouldValidate={setShouldValidate}
            />
          </div>

          <div
            className={clsx(
              'flex flex-1 min-w-0',
              mode === 'preview' ? 'flex' : 'hidden lg:flex'
            )}
          >
            <WritePostPreview htmlSource={htmlSource} />
          </div>
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
