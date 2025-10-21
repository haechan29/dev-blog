'use client';

import WritePostContentEditor from '@/components/write/writePostContentEditor';
import WritePostContentPreview from '@/components/write/writePostContentPreview';
import WritePostContentToolbar from '@/components/write/writePostContentToolbar';
import useParseHtml from '@/features/write/hooks/useParseHtml';
import useWritePostContent from '@/features/write/hooks/useWritePostContent';
import { WritePostFormProps } from '@/features/write/ui/writePostFormProps';
import { WritePostValidityProps } from '@/features/write/ui/writePostValidityProps';

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
  const { htmlSource, isError } = useParseHtml({ content });
  const {
    writePostContent: { contentToolbar, contentButtons },
    contentEditorRef,
    onAction,
    setIsEditorFocused,
  } = useWritePostContent({
    content,
    setContent,
  });

  return (
    <div className='h-full grid grid-rows-[50%_100%] lg:grid-rows-none lg:grid-cols-2 gap-4'>
      <div className='h-full flex flex-col'>
        <WritePostContentToolbar
          contentToolbar={contentToolbar}
          contentButtons={contentButtons}
          onAction={onAction}
        />
        <div className='flex-1 min-h-0'>
          <WritePostContentEditor
            contentEditorRef={contentEditorRef}
            content={content}
            isContentValid={isContentValid}
            isError={isError}
            shouldAttachToolbarToBottom={contentToolbar.shouldAttachToBottom}
            setContent={setContent}
            setShouldValidate={setShouldValidate}
            setIsEditorFocused={setIsEditorFocused}
          />
        </div>
      </div>

      <WritePostContentPreview htmlSource={htmlSource} />
    </div>
  );
}
