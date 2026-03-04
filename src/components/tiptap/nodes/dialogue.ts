import { Node, mergeAttributes } from '@tiptap/core';

export interface DialogueOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    dialogue: {
      setDialogue: (options: {
        speaker: string;
        avatar?: string;
      }) => ReturnType;
    };
  }
}

export default Node.create<DialogueOptions>({
  name: 'dialogue',

  group: 'block',

  content: 'inline*',

  selectable: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      speaker: {
        default: '',
      },
      avatar: {
        default: '',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-dialogue]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-dialogue': '',
        'data-speaker': HTMLAttributes.speaker,
        'data-avatar': HTMLAttributes.avatar,
      }),
      ['div', { class: 'dialogue-content' }, 0],
    ];
  },

  addCommands() {
    return {
      setDialogue:
        options =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
            content: [{ type: 'text', text: '대사를 입력하세요.' }],
          });
        },
    };
  },
});
