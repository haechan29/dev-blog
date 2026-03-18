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

export default Node.create<ImageWithCaptionOptions>({
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
        default: 'medium',
      },
      id: {
        default: null,
      },
      status: {
        default: 'success',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'figure[data-image-with-caption]',
        getAttrs: dom => {
          if (!(dom instanceof HTMLElement)) return {};

          const img = dom.querySelector('img');
          const sizeRaw = dom.getAttribute('data-size');
          const size =
            sizeRaw === 'medium' || sizeRaw === 'large' ? sizeRaw : 'medium';

          const statusRaw = dom.getAttribute('data-status');
          const status =
            statusRaw === 'loading' ||
            statusRaw === 'failed' ||
            statusRaw === 'success'
              ? statusRaw
              : 'success';

          return {
            src: img?.getAttribute('src') ?? '',
            alt: img?.getAttribute('alt') ?? '',
            size,
            id: dom.getAttribute('data-id') ?? null,
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
