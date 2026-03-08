import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import LinkCardView from '@/components/tiptap/editor/views/linkCard';

export interface LinkCardOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    linkCard: {
      setLinkCard: (options: {
        href: string;
        variant?: 'vertical' | 'horizontal';
      }) => ReturnType;
    };
  }
}

export default Node.create<LinkCardOptions>({
  name: 'linkCard',

  group: 'block',

  atom: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      href: {
        default: '',
      },
      variant: {
        default: 'vertical',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-link-card]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-link-card': '',
        'data-href': HTMLAttributes.href,
        'data-variant': HTMLAttributes.variant,
      }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(LinkCardView);
  },

  addCommands() {
    return {
      setLinkCard:
        options =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              href: options.href,
              variant: options.variant || 'vertical',
            },
          });
        },
    };
  },
});
