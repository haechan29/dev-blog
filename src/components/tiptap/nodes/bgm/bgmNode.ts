import BgmView from '@/components/tiptap/nodes/bgm/bgmView';
import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';

export interface BgmOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    bgm: {
      setBgm: (options: { src: string }) => ReturnType;
    };
  }
}

const BgmNode = Node.create<BgmOptions>({
  name: 'bgm',

  group: 'block',

  atom: true, // 내부 콘텐츠 없이 단일 블록으로 동작

  selectable: true,

  draggable: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      src: {
        default: '',
      },
      status: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-status'),
        renderHTML: (attributes) => {
          if (!attributes.status) return {};
          return { 'data-status': attributes.status };
        },
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
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        src: HTMLAttributes.src,
      }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(BgmView);
  },

  addCommands() {
    return {
      setBgm:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },
});

export default BgmNode;
