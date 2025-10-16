'use client';

import { WritePostProps } from '@/features/write/ui/writePostProps';
import clsx from 'clsx';
import { useCallback, useMemo } from 'react';

export default function WritePostEditor({
  content,
  setContent,
  invalidField,
}: {
  content: string;
  setContent: (content: string) => void;
  invalidField: WritePostProps['invalidField'];
}) {
  const insertMarkdown = useCallback(
    (before: string, after: string = '') => {
      setContent(content + before + after);
    },
    [content, setContent]
  );

  return (
    <div className='w-full min-h-screen flex flex-col'>
      <EditorToolbar insertMarkdown={insertMarkdown} />
      <EditorContent
        content={content}
        setContent={setContent}
        invalidField={invalidField}
      />
    </div>
  );
}

function EditorToolbar({
  insertMarkdown,
}: {
  insertMarkdown: (before: string, after?: string) => void;
}) {
  return (
    <div className='flex border-t border-x border-gray-200 rounded-t-lg gap-2 p-3'>
      <HeadingButton level={1} insertMarkdown={insertMarkdown} />
      <HeadingButton level={2} insertMarkdown={insertMarkdown} />
      <HeadingButton level={3} insertMarkdown={insertMarkdown} />
      <BoldButton insertMarkdown={insertMarkdown} />
      <ItalicButton insertMarkdown={insertMarkdown} />
      <StrikethroughButton insertMarkdown={insertMarkdown} />
      <LinkButton insertMarkdown={insertMarkdown} />
      <BgmButton insertMarkdown={insertMarkdown} />
    </div>
  );
}

function EditorContent({
  content,
  setContent,
  invalidField,
}: {
  content: string;
  setContent: (value: string) => void;
  invalidField: WritePostProps['invalidField'];
}) {
  const isInvalid = useMemo(() => invalidField === 'content', [invalidField]);

  return (
    <textarea
      value={content}
      onChange={e => setContent(e.target.value)}
      placeholder='본문을 입력하세요...'
      className={clsx(
        'flex-1 p-4 resize-none outline-none border rounded-b-lg',
        isInvalid
          ? 'border-red-400 animate-shake'
          : 'border-gray-200 hover:border-blue-500 focus:border-blue-500',
        content ? 'bg-white' : 'bg-gray-50'
      )}
    />
  );
}

function HeadingButton({
  level,
  insertMarkdown,
}: {
  level: 1 | 2 | 3;
  insertMarkdown: (before: string, after?: string) => void;
}) {
  return (
    <button
      onClick={() => insertMarkdown('#'.repeat(level) + ' ')}
      className='px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50'
    >
      제목{level}
    </button>
  );
}

function BoldButton({
  insertMarkdown,
}: {
  insertMarkdown: (before: string, after?: string) => void;
}) {
  return (
    <button
      onClick={() => insertMarkdown('**', '**')}
      className='px-3 py-1 text-sm font-bold border border-gray-300 rounded hover:bg-gray-50'
    >
      B
    </button>
  );
}

function ItalicButton({
  insertMarkdown,
}: {
  insertMarkdown: (before: string, after?: string) => void;
}) {
  return (
    <button
      onClick={() => insertMarkdown('*', '*')}
      className='px-3 py-1 text-sm italic border border-gray-300 rounded hover:bg-gray-50'
    >
      I
    </button>
  );
}

function StrikethroughButton({
  insertMarkdown,
}: {
  insertMarkdown: (before: string, after?: string) => void;
}) {
  return (
    <button
      onClick={() => insertMarkdown('~~', '~~')}
      className='px-3 py-1 text-sm line-through border border-gray-300 rounded hover:bg-gray-50'
    >
      취소선
    </button>
  );
}

function LinkButton({
  insertMarkdown,
}: {
  insertMarkdown: (before: string, after?: string) => void;
}) {
  return (
    <button
      onClick={() => insertMarkdown('[]()')}
      className='px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50'
    >
      링크
    </button>
  );
}

function BgmButton({
  insertMarkdown,
}: {
  insertMarkdown: (before: string, after?: string) => void;
}) {
  return (
    <button
      onClick={() => insertMarkdown('<iframe src="youtube.com/embed/" />')}
      className='px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50'
    >
      🎵BGM
    </button>
  );
}
