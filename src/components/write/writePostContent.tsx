'use client';

import WritePostContentEditor from '@/components/write/writePostContentEditor';
import WritePostContentPreview from '@/components/write/writePostContentPreview';
import WritePostContentToolbar from '@/components/write/writePostContentToolbar';
import useParseHtml from '@/features/write/hooks/useParseHtml';
import useWritePostContentButton from '@/features/write/hooks/useWritePostContentButton';
import useWritePostContentToolbar from '@/features/write/hooks/useWritePostContentToolbar';
import { WritePostFormProps } from '@/features/write/ui/writePostFormProps';
import { useRef } from 'react';

export default function WritePostContent({
  content,
  setContent,
  resetInvalidField,
}: {
  content: WritePostFormProps['content'];
  setContent: (content: string) => void;
  resetInvalidField: () => void;
}) {
  const contentEditorRef = useRef<HTMLTextAreaElement | null>(null);
  const { htmlSource, isError } = useParseHtml(content);
  const { contentToolbar, setIsEditorFocused } = useWritePostContentToolbar();
  const contentButton = useWritePostContentButton({
    ...content,
    contentEditorRef,
    setContent,
  });

  return (
    <div className='h-full grid max-lg:grid-rows-[50%_100%] lg:grid-cols-2 gap-4'>
      <div className='h-full flex flex-col max-lg:min-w-0 lg:min-h-0'>
        <WritePostContentToolbar {...contentToolbar} {...contentButton} />
        <div className='flex-1 min-h-0'>
          <WritePostContentEditor
            contentEditorRef={contentEditorRef}
            isError={isError}
            {...content}
            {...contentToolbar}
            setContent={setContent}
            resetInvalidField={resetInvalidField}
            setIsEditorFocused={setIsEditorFocused}
          />
        </div>
      </div>

      <div className='max-md:pb-4 max-lg:min-w-0 lg:min-h-0'>
        <WritePostContentPreview htmlSource={htmlSource} />
      </div>
    </div>
  );
}
