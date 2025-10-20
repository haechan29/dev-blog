'use client';

import WritePostContentEditor from '@/components/write/writePostContentEditor';
import WritePostContentPreview from '@/components/write/writePostContentPreview';
import WritePostContentToolbar from '@/components/write/writePostContentToolbar';
import useParseHtml from '@/features/write/hooks/useParseHtml';
import useWritePostEditor from '@/features/write/hooks/useWritePostEditor';
import { WritePostFormProps } from '@/features/write/ui/writePostFormProps';
import { WritePostValidityProps } from '@/features/write/ui/writePostValidityProps';
import clsx from 'clsx';
import { useState } from 'react';

export type Mode = 'edit' | 'preview';

export default function WritePostContent({
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
  const { htmlSource, isError } = useParseHtml({ content });
  const { writePostEditors, contentEditorRef, onAction } = useWritePostEditor({
    content,
    setContent,
  });

  return (
    <div className='w-full h-full flex flex-col'>
      <WritePostContentToolbar
        writePostEditors={writePostEditors}
        mode={mode}
        onAction={onAction}
        setMode={setMode}
      />
      <div className='flex flex-1 min-h-0 prose'>
        <div
          className={clsx(
            'flex-1 min-w-0',
            mode === 'edit' ? 'flex' : 'hidden lg:flex'
          )}
        >
          <WritePostContentEditor
            contentEditorRef={contentEditorRef}
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
          <WritePostContentPreview htmlSource={htmlSource} />
        </div>
      </div>
    </div>
  );
}
