'use client';

import WritePostContentEditor from '@/components/write/writePostContentEditor';
import WritePostContentPreview from '@/components/write/writePostContentPreview';
import WritePostContentToolbar from '@/components/write/writePostContentToolbar';
import useParseHtml from '@/features/write/hooks/useParseHtml';
import useWritePostContentButton from '@/features/write/hooks/useWritePostContentButton';
import useWritePostContentToolbar from '@/features/write/hooks/useWritePostContentToolbar';
import { WritePostFormProps } from '@/features/write/ui/writePostFormProps';
import { WritePostValidityProps } from '@/features/write/ui/writePostValidityProps';
import { useRef } from 'react';

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
  const contentEditorRef = useRef<HTMLTextAreaElement | null>(null);
  const { htmlSource, isError } = useParseHtml({ content });
  const { contentToolbar, setIsEditorFocused } = useWritePostContentToolbar();
  const contentButton = useWritePostContentButton({
    content,
    contentEditorRef,
    setContent,
  });

  return (
    <div className='h-full grid grid-rows-[50%_100%] lg:grid-rows-none lg:grid-cols-2 gap-4'>
      <div className='h-full flex flex-col'>
        <WritePostContentToolbar {...contentToolbar} {...contentButton} />
        <div className='flex-1 min-h-0'>
          <WritePostContentEditor
            contentEditorRef={contentEditorRef}
            content={content}
            isContentValid={isContentValid}
            isError={isError}
            {...contentToolbar}
            setContent={setContent}
            setShouldValidate={setShouldValidate}
            setIsEditorFocused={setIsEditorFocused}
          />
        </div>
      </div>

      <div className='max-md:pb-4'>
        <WritePostContentPreview htmlSource={htmlSource} />
      </div>
    </div>
  );
}
