import { Node, mergeAttributes } from '@tiptap/core';

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
        status?: 'loading' | 'failed' | 'success';
      }) => ReturnType;
    };
  }
}

const ImageWithCaptionNode = Node.create<ImageWithCaptionOptions>({
  name: 'imageWithCaption',

  group: 'block',

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
        default: 'medium' as 'medium' | 'large',
      },
      id: {
        default: null as string | null,
      },
      status: {
        default: 'success' as 'loading' | 'failed' | 'success',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'figure[data-image-with-caption]',
        getAttrs: dom => {
          if (typeof dom === 'string') return false;

          const img = (dom as any).querySelector?.('img');
          const sizeRaw = (dom as any).getAttribute?.('data-size');
          const size =
            sizeRaw === 'medium' || sizeRaw === 'large' ? sizeRaw : 'medium';

          const statusRaw = (dom as any).getAttribute?.('data-status');
          const status =
            statusRaw === 'loading' ||
            statusRaw === 'failed' ||
            statusRaw === 'success'
              ? statusRaw
              : 'success';

          return {
            src: img?.getAttribute?.('src') ?? '',
            alt: img?.getAttribute?.('alt') ?? '',
            size,
            id: (dom as any).getAttribute?.('data-id') ?? null,
            status,
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'figure',
      mergeAttributes(this.options.HTMLAttributes, {
        'data-image-with-caption': '',
        'data-size': HTMLAttributes.size,
        'data-id': HTMLAttributes.id,
        'data-status': HTMLAttributes.status,
      }),
      ['img', { src: HTMLAttributes.src, alt: HTMLAttributes.alt }],
      ['figcaption', {}, HTMLAttributes.alt || ''],
    ];
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
