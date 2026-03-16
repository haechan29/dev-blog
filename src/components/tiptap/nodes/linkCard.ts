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
        parseHTML: element => element.getAttribute('data-href') ?? '',
        renderHTML: attributes =>
          attributes.href ? { 'data-href': attributes.href } : {},
      },
      variant: {
        default: 'vertical',
        parseHTML: element => {
          const v = element.getAttribute('data-variant');
          return v === 'vertical' || v === 'horizontal' ? v : 'vertical';
        },
        renderHTML: attributes =>
          attributes.variant ? { 'data-variant': attributes.variant } : {},
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
            attrs: options,
          });
        },
    };
  },
});
