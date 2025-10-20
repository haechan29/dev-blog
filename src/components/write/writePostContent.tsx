'use client';

import WritePostContentEditor from '@/components/write/writePostContentEditor';
import WritePostContentPreview from '@/components/write/writePostContentPreview';
import WritePostContentToolbar, {
  ToolbarButton,
} from '@/components/write/writePostContentToolbar';
import useParseHtml from '@/features/write/hooks/useParseHtml';
import { WritePostFormProps } from '@/features/write/ui/writePostFormProps';
import { WritePostValidityProps } from '@/features/write/ui/writePostValidityProps';
import clsx from 'clsx';
import { useCallback, useRef, useState } from 'react';

type Mode = 'edit' | 'preview';
type TextParts = {
  textBefore: string;
  selectedText: string;
  textAfter: string;
  markdownBefore: string;
  markdownAfter?: string;
};

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
  const contentEditorRef = useRef<HTMLTextAreaElement | null>(null);

  const insertMarkdown = useCallback(
    ({
      textBefore,
      selectedText,
      textAfter,
      markdownBefore,
      markdownAfter = '',
    }: TextParts) => {
      const newText = markdownBefore + selectedText + markdownAfter;
      const newCursorPosition = selectedText
        ? textBefore.length + newText.length
        : textBefore.length + markdownBefore.length;
      return { newText: textBefore + newText + textAfter, newCursorPosition };
    },
    []
  );

  const removeMarkdown = useCallback(
    ({
      textBefore,
      selectedText,
      textAfter,
      markdownBefore,
      markdownAfter = '',
    }: TextParts) => {
      const newText = selectedText
        ? textBefore +
          selectedText.slice(markdownBefore.length, -markdownAfter.length) +
          textAfter
        : textBefore.slice(0, -markdownBefore.length) +
          textAfter.slice(markdownAfter.length);
      console.log(newText);
      const newCursorPosition = selectedText
        ? newText.length - textAfter.length
        : textBefore.length - markdownBefore.length;
      return { newText, newCursorPosition } as const;
    },
    []
  );

  const onAction = useCallback(
    ({ actionType, markdownBefore, markdownAfter = '' }: ToolbarButton) => {
      if (!contentEditorRef.current) return;
      const contentEditor = contentEditorRef.current;

      const [start, end] = [
        contentEditor.selectionStart,
        contentEditor.selectionEnd,
      ];
      const [textBefore, selectedText, textAfter] = [
        content.substring(0, start),
        content.substring(start, end),
        content.substring(end),
      ];
      const isWrapped = selectedText
        ? selectedText.startsWith(markdownBefore) &&
          selectedText.endsWith(markdownAfter)
        : textBefore.endsWith(markdownBefore) &&
          textAfter.startsWith(markdownAfter);

      const shouldInsert = actionType === 'insert' || !isWrapped;
      const { newText, newCursorPosition } = shouldInsert
        ? insertMarkdown({
            textBefore,
            selectedText,
            textAfter,
            markdownBefore,
            markdownAfter,
          })
        : removeMarkdown({
            textBefore,
            selectedText,
            textAfter,
            markdownBefore,
            markdownAfter,
          });
      setContent(newText);
      setTimeout(() => {
        contentEditor.focus();
        contentEditor.setSelectionRange(newCursorPosition, newCursorPosition);
      }, 0);
    },
    [content, insertMarkdown, removeMarkdown, setContent]
  );

  return (
    <div className='w-full gap-4 mb-10'>
      <div className='lg:hidden'>
        <ModeToggle mode={mode} setMode={setMode} />
      </div>

      <div className='w-full'>
        <WritePostContentToolbar onAction={onAction} />
        <div className='w-full flex prose min-h-screen'>
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
