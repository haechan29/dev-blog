import ImageWithCaption from '@/components/tiptap/editor/views/imageWithCaption';
import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';

export interface ImageWithCaptionOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    imageWithCaption: {
      setImageWithCaption: (options: {
        src: string;
        alt?: string;
        size?: 'medium' | 'large';
        id?: string;
        status?: 'loading' | 'failed' | null;
      }) => ReturnType;
    };
  }
}

export default Node.create<ImageWithCaptionOptions>({
  name: 'imageWithCaption',

  group: 'block',

  selectable: true,

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
      alt: {
        default: '',
      },
      size: {
        default: 'medium',
      },
      id: {
        default: null,
      },
      status: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'figure[data-image-with-caption]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'figure',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-image-with-caption': '',
      }),
      ['img', { src: HTMLAttributes.src, alt: HTMLAttributes.alt }],
      ['figcaption', {}, HTMLAttributes.alt || ''],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageWithCaption);
  },

  addCommands() {
    return {
      setImageWithCaption:
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
