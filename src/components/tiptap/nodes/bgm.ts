import { Node, mergeAttributes } from '@tiptap/core';

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

  selectable: true,

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
      },
      src: {
        default: '',
      },
      status: {
        default: null,
        parseHTML: element => element.getAttribute('data-status'),
        renderHTML: attributes => {
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
