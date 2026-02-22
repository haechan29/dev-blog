'use client';

import { NodeViewContent, NodeViewProps, NodeViewWrapper } from '@tiptap/react';
import { useState } from 'react';

export default function DialogueView({
  node,
  updateAttributes,
}: NodeViewProps) {
  const { speaker, avatar } = node.attrs;
  const [isEditingSpeaker, setIsEditingSpeaker] = useState(false);
  const [speakerInput, setSpeakerInput] = useState(speaker);

  const handleSpeakerSubmit = () => {
    updateAttributes({ speaker: speakerInput });
    setIsEditingSpeaker(false);
  };

  const handleAvatarClick = () => {
    const url = window.prompt('아바타 이미지 URL을 입력하세요:', avatar || '');
    if (url !== null) {
      updateAttributes({ avatar: url });
    }
  };

  return (
    <NodeViewWrapper className="not-prose flex gap-3 my-4 p-3 bg-gray-50 rounded-lg">
      {/* 아바타 */}
      <div
        onClick={handleAvatarClick}
        className="w-10 h-10 rounded-full bg-pink-400 flex-shrink-0 cursor-pointer overflow-hidden"
      >
        {avatar && (
          <img
            src={avatar}
            alt={speaker}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* 화자명 + 대사 */}
      <div className="flex-1">
        {/* 화자명 */}
        {isEditingSpeaker ? (
          <input
            type="text"
            value={speakerInput}
            onChange={(e) => setSpeakerInput(e.target.value)}
            onBlur={handleSpeakerSubmit}
            onKeyDown={(e) => e.key === 'Enter' && handleSpeakerSubmit()}
            autoFocus
            className="text-sm font-semibold text-pink-500 bg-transparent border-b border-pink-300 outline-none mb-1"
          />
        ) : (
          <div
            onClick={() => setIsEditingSpeaker(true)}
            className="text-sm font-semibold text-pink-500 cursor-pointer mb-1"
          >
            {speaker || '화자명 클릭하여 입력'}
          </div>
        )}

        {/* 대사 내용 */}
        <NodeViewContent className="text-gray-800" />
      </div>
    </NodeViewWrapper>
  );
}
