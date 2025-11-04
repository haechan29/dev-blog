'use client';

import WritePostContentEditor from '@/components/write/writePostContentEditor';
import WritePostContentPreview from '@/components/write/writePostContentPreview';
import WritePostContentToolbar from '@/components/write/writePostContentToolbar';
import { Content } from '@/features/write/domain/types/content';
import useWritePostContentButton from '@/features/write/hooks/useWritePostContentButton';
import useWritePostContentToolbar from '@/features/write/hooks/useWritePostContentToolbar';
import { WritePostFormProps } from '@/features/write/ui/writePostFormProps';
import useDebounce from '@/hooks/useDebounce';
import { processMd } from '@/lib/md';
import { SetState } from '@/types/react';
import { useEffect, useRef, useState } from 'react';

export default function WritePostContent({
  content,
  setContent,
  resetInvalidField,
}: {
  content: WritePostFormProps['content'];
  setContent: SetState<string>;
  resetInvalidField: () => void;
}) {
  const [parsedContent, setParsedContent] = useState<Content>({
    status: 'idle',
  });
  const debounce = useDebounce();
  const contentEditorRef = useRef<HTMLTextAreaElement | null>(null);
  const { contentToolbar, setIsEditorFocused } = useWritePostContentToolbar();
  const contentButton = useWritePostContentButton({
    ...content,
    contentEditorRef,
    setContent,
  });

  useEffect(() => {
    const parseMd = async (content: string) => {
      setParsedContent({ status: 'loading' });
      try {
        const result = await processMd(content);
        setParsedContent({ status: 'success', value: result });
      } catch {
        setParsedContent({ status: 'error' });
      }
    };

    debounce(() => parseMd(content.value), 300);
  }, [content.value, debounce]);

  return (
    <div className='h-full grid max-lg:grid-rows-[50%_100%] lg:grid-cols-2 gap-4'>
      <div className='h-full flex flex-col max-lg:min-w-0 lg:min-h-0'>
        <WritePostContentToolbar {...contentToolbar} {...contentButton} />
        <div className='flex-1 min-h-0'>
          <WritePostContentEditor
            contentEditorRef={contentEditorRef}
            parsedContent={parsedContent}
            {...content}
            {...contentToolbar}
            setContent={setContent}
            resetInvalidField={resetInvalidField}
            setIsEditorFocused={setIsEditorFocused}
          />
        </div>
      </div>

      <div className='max-md:pb-4 max-lg:min-w-0 lg:min-h-0'>
        <WritePostContentPreview parsedContent={parsedContent} />
      </div>
    </div>
  );
}
