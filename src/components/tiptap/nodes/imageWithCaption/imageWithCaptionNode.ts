import ImageWithCaptionView from '@/components/tiptap/nodes/imageWithCaption/imageWithCaptionView';
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
      }) => ReturnType;
    };
  }
}

const ImageWithCaptionNode = Node.create<ImageWithCaptionOptions>({
  name: 'imageWithCaption',

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
      src: {
        default: '',
      },
      alt: {
        default: '',
      },
      size: {
        default: 'large',
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
      ['figcaption', 0],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageWithCaptionView);
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

export default ImageWithCaptionNode;
