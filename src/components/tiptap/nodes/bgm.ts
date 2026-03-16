import BgmView from '@/components/tiptap/editor/views/bgm';
import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';

export interface BgmOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    bgm: {
      setBgm: (options: {
        id: string;
        src: string;
        status?: string | null;
      }) => ReturnType;
    };
  }
}

export default Node.create<BgmOptions>({
  name: 'bgm',

  group: 'block',

  atom: true,

  draggable: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: element => element.getAttribute('id'),
        renderHTML: attributes => (attributes.id ? { id: attributes.id } : {}),
      },
      src: {
        default: '',
        parseHTML: element => element.getAttribute('src') ?? '',
        renderHTML: attributes =>
          attributes.src ? { src: attributes.src } : {},
      },
      status: {
        default: null,
        parseHTML: element => element.getAttribute('data-status'),
        renderHTML: attributes =>
          attributes.status ? { 'data-status': attributes.status } : {},
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'bgm',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'bgm',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(BgmView, {
      className: 'flex justify-end',
    });
  },

  addCommands() {
    return {
      setBgm:
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
