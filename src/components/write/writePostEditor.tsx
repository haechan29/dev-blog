'use client';

import clsx from 'clsx';
import { useCallback, useState } from 'react';

export default function WritePostEditor({
  content,
  setContent,
}: {
  content: string;
  setContent: (content: string) => void;
}) {
  const [isContentValid, setIsContentValid] = useState(true);

  const insertMarkdown = useCallback(
    (before: string, after: string = '') => {
      setContent(content + before + after);
    },
    [content, setContent]
  );

  return (
    <div
      className={clsx(
        'w-full min-h-screen flex flex-col',
        'border border-gray-200 rounded-lg bg-white'
      )}
    >
      <EditorToolbar insertMarkdown={insertMarkdown} />
      <EditorContent
        content={content}
        setContent={setContent}
        isContentValid={isContentValid}
        setIsContentValid={setIsContentValid}
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
    <div className='flex gap-2 p-3 border-b border-gray-200'>
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
  isContentValid,
  setIsContentValid,
}: {
  content: string;
  setContent: (value: string) => void;
  isContentValid: boolean;
  setIsContentValid: (value: boolean) => void;
}) {
  return (
    <textarea
      value={content}
      onChange={e => {
        setIsContentValid(true);
        setContent(e.target.value);
      }}
      placeholder='본문을 입력하세요...'
      className={clsx(
        'flex-1 p-4 resize-none outline-none',
        isContentValid ? '' : 'border-red-400',
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
