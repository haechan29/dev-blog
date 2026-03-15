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
import Heading from '@/features/post/domain/types/heading';
import { JSONContent } from '@tiptap/core';
import { Table } from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import StarterKit from '@tiptap/starter-kit';
import { renderToReactElement } from '@tiptap/static-renderer/pm/react';
import GithubSlugger from 'github-slugger';

export function renderContentElement(contentJson: JSONContent | null) {
  if (!contentJson) return { headings: [], element: null };

  const slugger = new GithubSlugger();
  const headings: Heading[] = [];

  const contentElement = renderToReactElement({
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
    content: contentJson,
    options: {
      nodeMapping: {
        heading: ({ node, children }) => {
          const level = node.attrs.level as number;
          const textContent = node.textContent;
          const id = slugger.slug(textContent);
          headings.push({ id, level, textContent });

          const Tag = `h${level}` as keyof JSX.IntrinsicElements;
          return <Tag id={id}>{children}</Tag>;
        },
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
        paragraph: ({ children }) => {
          const isEmpty =
            !children || (Array.isArray(children) && children.length === 0);
          return <p>{isEmpty ? <br /> : children}</p>;
        },
      },
    },
  });

  return { headings, contentElement } as const;
}
