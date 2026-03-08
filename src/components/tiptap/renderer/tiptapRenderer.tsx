'use client';

import BgmNode from '@/components/tiptap/nodes/bgm';
import DialogueNode from '@/components/tiptap/nodes/dialogue';
import ImageWithCaptionNode from '@/components/tiptap/nodes/imageWithCaption';
import LinkCardNode from '@/components/tiptap/nodes/linkCard';
import BgmView from '@/components/tiptap/renderer/views/bgm';
import CodeBlockView from '@/components/tiptap/renderer/views/codeBlock';
import DialogueView from '@/components/tiptap/renderer/views/dialogue';
import HorizontalRuleView from '@/components/tiptap/renderer/views/horizontalRule';
import ImageWithCaptionView from '@/components/tiptap/renderer/views/imageWithCaption';
import LinkCardView from '@/components/tiptap/renderer/views/linkCard';
import { JSONContent } from '@tiptap/core';
import { Table } from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import StarterKit from '@tiptap/starter-kit';
import { renderToReactElement } from '@tiptap/static-renderer/pm/react';

export default function TiptapRenderer({ content }: { content: JSONContent }) {
  const element = renderToReactElement({
    extensions: [
      StarterKit,
      Table,
      TableRow,
      TableHeader,
      TableCell,
      LinkCardNode,
      ImageWithCaptionNode,
      DialogueNode,
      BgmNode,
    ],
    content,
    options: {
      nodeMapping: {
        horizontalRule: () => <HorizontalRuleView />,
        imageWithCaption: ({ node }) => (
          <ImageWithCaptionView
            src={node.attrs.src}
            alt={node.attrs.alt}
            size={node.attrs.size}
          />
        ),
        dialogue: ({ node, children }) => (
          <DialogueView speaker={node.attrs.speaker} avatar={node.attrs.avatar}>
            {children}
          </DialogueView>
        ),
        bgm: ({ node }) => <BgmView id={node.attrs.id} src={node.attrs.src} />,
        codeBlock: ({ children }) => <CodeBlockView>{children}</CodeBlockView>,
        linkCard: ({ node }) => (
          <LinkCardView href={node.attrs.href} variant={node.attrs.variant} />
        ),
      },
    },
  });

  return <div className='prose max-w-none'>{element}</div>;
}
