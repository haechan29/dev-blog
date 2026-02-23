'use client';

import BgmNode from '@/components/tiptap/nodes/bgm';
import DialogueNode from '@/components/tiptap/nodes/dialogue';
import ImageWithCaptionNode from '@/components/tiptap/nodes/imageWithCaption';
import Bgm from '@/components/tiptap/renderer/views/bgm';
import Dialogue from '@/components/tiptap/renderer/views/dialogue';
import ImageWithCaption from '@/components/tiptap/renderer/views/imageWithCaption';
import { JSONContent } from '@tiptap/core';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import StarterKit from '@tiptap/starter-kit';
import { renderToReactElement } from '@tiptap/static-renderer/pm/react';

export default function TiptapRenderer({ content }: { content: JSONContent }) {
  const element = renderToReactElement({
    extensions: [
      StarterKit,
      Underline,
      Link,
      ImageWithCaptionNode,
      DialogueNode,
      BgmNode,
    ],
    content,
    options: {
      nodeMapping: {
        imageWithCaption: ({ node }) => (
          <ImageWithCaption
            src={node.attrs.src}
            alt={node.attrs.alt}
            size={node.attrs.size}
          />
        ),
        dialogue: ({ node, children }) => (
          <Dialogue speaker={node.attrs.speaker} avatar={node.attrs.avatar}>
            {children}
          </Dialogue>
        ),
        bgm: ({ node }) => <Bgm id={node.attrs.id} src={node.attrs.src} />,
      },
    },
  });

  return <div className='prose max-w-none'>{element}</div>;
}
