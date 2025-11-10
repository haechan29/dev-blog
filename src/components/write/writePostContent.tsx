'use client';

import WritePostContentEditor from '@/components/write/writePostContentEditor';
import WritePostContentPreview from '@/components/write/writePostContentPreview';
import WritePostContentToolbar from '@/components/write/writePostContentToolbar';
import { Content } from '@/features/write/domain/types/content';
import useWritePostContentButton from '@/features/write/hooks/useWritePostContentButton';
import useWritePostForm from '@/features/write/hooks/useWritePostForm';
import useDebounce from '@/hooks/useDebounce';
import { processMd } from '@/lib/md/md';
import { useEffect, useRef, useState } from 'react';

export default function WritePostContent() {
  const {
    writePostForm: {
      content: { value: content },
    },
  } = useWritePostForm();
  const [parsedContent, setParsedContent] = useState<Content>({
    status: 'idle',
  });
  const debounce = useDebounce();
  const contentEditorRef = useRef<HTMLTextAreaElement | null>(null);
  const contentButton = useWritePostContentButton({ contentEditorRef });

  useEffect(() => {
    const parseMd = async (content: string) => {
      if (!contentEditorRef.current || content.length === 0) {
        setParsedContent({ status: 'idle' });
        return;
      }
      const contentEditor = contentEditorRef.current;

      setParsedContent({ status: 'loading' });
      try {
        const result = await processMd(content, contentEditor.selectionStart);
        setParsedContent({ status: 'success', value: result });
      } catch (error) {
        setParsedContent({ status: 'error' });
        console.log(error);
      }
    };

    debounce(() => parseMd(content), 300);
  }, [content, debounce]);

  return (
    <div className='h-full grid max-lg:grid-rows-[calc(50%-0.5rem)_calc(50%-0.5rem)] lg:grid-cols-2 gap-4'>
      <div className='h-full flex flex-col max-lg:min-w-0 lg:min-h-0'>
        <WritePostContentToolbar {...contentButton} />
        <div className='flex-1 min-h-0'>
          <WritePostContentEditor
            contentEditorRef={contentEditorRef}
            parsedContent={parsedContent}
          />
        </div>
      </div>

      <div className='max-lg:min-w-0 lg:min-h-0'>
        <WritePostContentPreview parsedContent={parsedContent} />
      </div>
    </div>
  );
}
