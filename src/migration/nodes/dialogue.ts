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

const DialogueNode = Node.create<DialogueOptions>({
  name: 'dialogue',

  group: 'block',

  content: 'paragraph*',

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      speaker: {
        default: '',
        parseHTML: element => element.getAttribute('data-speaker') ?? '',
        renderHTML: attributes =>
          attributes.speaker ? { 'data-speaker': attributes.speaker } : {},
      },
      avatar: {
        default: '',
        parseHTML: element => element.getAttribute('data-avatar') ?? '',
        renderHTML: attributes =>
          attributes.avatar ? { 'data-avatar': attributes.avatar } : {},
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
      }),
      0,
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
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: '대사를 입력하세요.' }],
              },
            ],
          });
        },
    };
  },
});

export default DialogueNode;
