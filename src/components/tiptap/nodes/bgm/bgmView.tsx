'use client';

import { NodeViewProps, NodeViewWrapper } from '@tiptap/react';
import clsx from 'clsx';
import { AlertCircle, Loader2, Music, Pencil } from 'lucide-react';
import { useState } from 'react';

export default function BgmView({ node, updateAttributes, selected }: NodeViewProps) {
  const { src, status } = node.attrs;
  const [isEditing, setIsEditing] = useState(false);
  const [srcInput, setSrcInput] = useState(src);

  const isLoading = status === 'loading';
  const isError = status === 'failed';

  const handleSrcSubmit = () => {
    updateAttributes({ src: srcInput });
    setIsEditing(false);
  };

  return (
    <NodeViewWrapper
      className={clsx(
        'my-4 flex items-center gap-3 p-3 rounded-lg transition-colors',
        selected ? 'bg-blue-50 ring-2 ring-blue-300' : 'bg-gray-50'
      )}
    >
      {/* BGM 아이콘 */}
      <div
        className={clsx(
          'p-2 rounded-lg transition-colors',
          isError ? 'bg-red-100' : 'bg-gray-100'
        )}
      >
        <div className="p-2 bg-white rounded-md relative">
          <Music
            className={clsx(
              'w-4 h-4',
              isLoading ? 'text-gray-400' : isError ? 'invisible' : 'text-gray-900'
            )}
          />
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-7 h-7 animate-spin text-gray-400" />
            </div>
          )}
          {isError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-400" />
            </div>
          )}
        </div>
      </div>

      {/* 소스 URL 표시/편집 */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            type="text"
            value={srcInput}
            onChange={(e) => setSrcInput(e.target.value)}
            onBlur={handleSrcSubmit}
            onKeyDown={(e) => e.key === 'Enter' && handleSrcSubmit()}
            autoFocus
            placeholder="BGM 소스 URL 입력"
            className="w-full text-sm bg-transparent border-b border-gray-300 outline-none focus:border-blue-500"
          />
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 truncate">
              {src || '(소스 없음)'}
            </span>
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 hover:bg-gray-200 rounded"
            >
              <Pencil className="w-3 h-3 text-gray-400" />
            </button>
          </div>
        )}
      </div>

      {/* 상태 표시 */}
      {status && (
        <span
          className={clsx(
            'text-xs px-2 py-1 rounded',
            isError ? 'bg-red-100 text-red-600' : 'bg-gray-200 text-gray-600'
          )}
        >
          {isError ? '오류' : '로딩 중'}
        </span>
      )}
    </NodeViewWrapper>
  );
}
